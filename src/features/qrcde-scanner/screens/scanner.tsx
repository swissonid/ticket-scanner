'use client';

import { useState, useRef } from 'react';
import { ScanResult } from '../domain/scanner-result';
import { CameraViewfinder } from '../components/camera-finder';
import { ResultSheet } from '../components/result-sheet';
import QrScanner from '../components/qr-scanner';
import { AudioSwitch } from '../components/audio-switch';
import { IScannerControls } from '@zxing/browser';

export type ScannerState = 'ready' | 'scanning' | 'result' | 'error';

export function Scanner() {
  const [state, setState] = useState<ScannerState>('ready');
  const [result, setResult] = useState<ScanResult | null>(null);
  const audioEnabledRef = useRef(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const controllerRef = useRef<IScannerControls | null>(null);
  const qrScannerRef = useRef<{
    startScanning: () => void;
    stopScanning: () => void;
  }>(null);

  const handleScan = async (
    qrcode: string,
    scannerController?: IScannerControls
  ) => {
    controllerRef.current = scannerController ?? null;
    playAudio();
    setResult({
      success: true,
      message: 'QR Code scanned successfully',
      code: qrcode,
    });
    setState('result');
  };

  const handleAudioSwitch = (
    isEnabled: boolean,
    audioElement: HTMLAudioElement
  ) => {
    audioEnabledRef.current = isEnabled;
    if (isEnabled) {
      audioElement.play();
      audioElementRef.current = audioElement;
    } else {
      audioElementRef.current = null;
    }
  };

  const playAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play();
    }
  };

  const handleReset = () => {
    setState('ready');
    setResult(null);
    console.log(`qrSacnnerRef: ${JSON.stringify(qrScannerRef, null, 2)}`);
    if (qrScannerRef.current) {
      console.log('Try to restart scanner');
      qrScannerRef.current.startScanning();
    }
  };

  return (
    <>
      <CameraViewfinder
        underFinder={
          <AudioSwitch
            onChange={handleAudioSwitch}
            isEnable={audioEnabledRef.current}
          />
        }
      >
        <QrScanner
          ref={qrScannerRef}
          className="h-full w-full"
          handleScan={handleScan}
        />
      </CameraViewfinder>

      <ResultSheet
        result={result}
        isOpen={state === 'result'}
        onClose={handleReset}
      />
    </>
  );
}
