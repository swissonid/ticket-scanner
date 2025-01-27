'use client';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type ScannerState = 'initializing' | 'ready' | 'scanning' | 'result';

type QrScannerProps = {
  handleScan: (result: string) => void;
} & React.HTMLAttributes<HTMLVideoElement>;

export interface ScanResult {
  success: boolean;
  message: string;
  code?: string;
}

export function QrScanner({ className, handleScan }: QrScannerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState<ScannerState>('ready');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, setResult] = useState<ScanResult | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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

  const internalHandleScan = useCallback(
    (result: string) => {
      handleScan(result);
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
      handleError(error as Error);
    }
  }, [hasPermission, requestCameraPermission, internalHandleScan, handleError]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stopScanning = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setState('ready');
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = useCallback(() => {
    setResult(null);
    startScanning();
  }, [startScanning]);

  useEffect(() => {
    startScanning();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [startScanning]);

  return (
    <video
      ref={videoRef}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
    />
  );
}
