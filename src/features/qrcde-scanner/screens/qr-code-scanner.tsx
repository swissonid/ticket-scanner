'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { BrowserQRCodeReader } from '@zxing/browser';

type Permissions = 'prompt' | 'granted' | 'denied' | 'notAskedYet';

export default function QRCodeScanner() {
  const [permission, setPermission] = useState<Permissions>('notAskedYet');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  // const [scannerControl, setScannerControl] = useState<IScannerControls | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error>();

  const checkPermission = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: 'environment', // backcamere
        },
      });
      setPermission('granted');
      setStream(stream);
      return ['granted', stream, null];
    } catch (error) {
      console.error('Error accessing camera:', error);
      return ['prompt', null, error];
    }
  };

  const startCamera = useCallback(async () => {
    console.log('Try to start camera');
    try {
      if (!stream) {
        const localStream = await navigator.mediaDevices?.getUserMedia({
          video: {
            facingMode: 'environment', // backcamere
          },
        });
        setStream(localStream);
      }
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        setIsCameraStarted(true);
        console.log('Started Camera :D');
      } else
        console.log(
          `Camera not started: stream: ${stream}, videoRef.current: ${videoRef.current}`
        );
    } catch (error) {
      setError(new Error('Oops! Camera failed to start!'));
      console.error('Error accessing webcam', error);
    }
  }, [stream, videoRef]);

  useEffect(() => {
    startCamera();
  }, [startCamera, permission]);

  useEffect(() => {
    checkPermission();
  }, []);

  /*const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };*/

  /* const stopScanning = () => {
    if (!scannerControl) return;
    scannerControl.stop();
    setStream(null);
    setIsScanning(false);
  }*/

  const startScanning = useCallback(async () => {
    if (!stream) return;

    const codeReader = new BrowserQRCodeReader();
    try {
      console.log('Start scanning');
      setIsScanning(true);
      const result = await codeReader.decodeOnceFromStream(
        stream,
        videoRef.current!
      );
      setResult(result.getText());
    } catch (error) {
      setError(new Error('QR code scanning error!'));
      console.error('QR code scanning error:', error);
      setIsScanning(false);
    }
  }, [stream]);

  const handleOkClick = () => {
    setResult(null);
    startScanning();
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6">
      <h1 className="text-3xl font-bold">Ticket Scanner</h1>
      <div className="h-4" />
      <div className="relative aspect-square w-[calc(100%_-_4rem)] rounded-2xl">
        <video
          ref={videoRef}
          className="h-full w-full rounded-xl object-cover"
          autoPlay
          playsInline
          muted
          hidden={!isCameraStarted}
        />
        <div className="h-4" />
        <Button
          disabled={isScanning}
          onClick={startScanning}
          className="h-12 w-full"
        >
          Scann
        </Button>
        {/* <Button disabled={!isScanning} onClick={stopScanning} className="ml-2"> Stop scanning</Button> */}
        <div className="h-4" />
      </div>

      <Sheet open={permission === 'prompt'}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Camera Permission</SheetTitle>
            <SheetDescription>
              We need access to your camera to scan QR codes. Please grant
              permission to continue.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <Button onClick={checkPermission}>Grant Permission</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!result}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>QR Code Result</SheetTitle>
            <SheetDescription>{result}</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <Button className="h-12 w-full" onClick={handleOkClick}>
              OK
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {permission === 'denied' && (
        <div className="mt-4 text-red-500">
          Camera permission denied. Please enable camera access in your browser
          settings.
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          Error accessing camera: {error.message}
        </div>
      )}
    </div>
  );
}
