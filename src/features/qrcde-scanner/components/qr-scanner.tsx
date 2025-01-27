'use client';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type ScannerState = 'initializing' | 'ready' | 'scanning' | 'result';

type QrScannerProps = {
  handleScan: (result: string) => void;
  onStageChange?: (newState: ScannerState) => void;
} & React.HTMLAttributes<HTMLVideoElement>;

export interface ScanResult {
  success: boolean;
  message: string;
  code?: string;
}

const QrScanner = forwardRef(
  ({ className, handleScan, onStageChange }: QrScannerProps, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, setState] = useState<ScannerState>('ready');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [result, setResult] = useState<ScanResult | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const readerRef = useRef<BrowserQRCodeReader | null>(null);

    const requestCameraPermission = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        return true;
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
        return false;
      }
    }, []);

    const captureFrame = () => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );
          setCapturedFrame(canvas.toDataURL('image/png'));
        }
      }
    };

    const internalHandleScan = useCallback(
      (result: string) => {
        captureFrame();
        handleScan(result);
        console.log(`Found QR-code: ${result}`);
        stopScanning(); // Stop scanning after a successful scan
      },
      [handleScan]
    );

    const handleError = useCallback((error: Error) => {
      console.error('Error scanning QR code:', error);
      setResult({
        success: false,
        message: 'Failed to scan QR code',
      });
      setState('result');
    }, []);

    const startScanning = useCallback(async () => {
      if (hasPermission === null) {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) return;
      }

      if (hasPermission === false) {
        handleError(new Error('Camera permission denied'));
        return;
      }

      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader();
      }

      setState('scanning');
      setCapturedFrame(null);
      console.log(`Qr-Scanner: 🚀 Start scanning`);

      try {
        controlsRef.current = await readerRef.current.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result) {
              internalHandleScan(result.getText());
            }
          }
        );
      } catch (error) {
        console.log(
          `Qr-Scanner: ❌ Start scanning error ${JSON.stringify(error)}`
        );
        handleError(error as Error);
      }
    }, [
      hasPermission,
      requestCameraPermission,
      internalHandleScan,
      handleError,
      onStageChange,
    ]);

    const stopScanning = useCallback(() => {
      console.log('Try to stopped scanning...');
      if (controlsRef.current) {
        controlsRef.current.stop();
        console.log('Stopped scanning...');
      }
      setState('ready');
    }, []);

    useImperativeHandle(ref, () => ({
      startScanning,
      stopScanning,
    }));

    useEffect(() => {
      startScanning();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const preventDefault = (event: Event) => event.preventDefault();

      return () => {
        if (controlsRef.current) {
          stopScanning();
        }
      };
    }, []);

    return (
      <>
        <video
          ref={videoRef}
          hidden={capturedFrame !== null}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            className
          )}
          tabIndex={-1} // Ensure the video element is not focusable
        />
        <img
          src={capturedFrame ?? undefined}
          alt="Captured frame"
          hidden={capturedFrame === null}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            className
          )}
        />
      </>
    );
  }
);

QrScanner.displayName = 'QrScanner';

export default QrScanner;
