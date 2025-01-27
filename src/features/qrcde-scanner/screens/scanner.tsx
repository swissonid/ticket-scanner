'use client';

import { useState, useRef } from 'react';
import { ScanResult } from '../domain/scanner-result';
import { CameraViewfinder } from '../components/camera-finder';
import { ResultSheet } from '../components/result-sheet';
import { QrScanner } from '../components/qr-scanner';
import { AudioSwitch } from '../components/audio-switch';

export type ScannerState = 'ready' | 'scanning' | 'result' | 'error';

export function Scanner() {
  const [state, setState] = useState<ScannerState>('ready');
  const [result, setResult] = useState<ScanResult | null>(null);
  const audioEnabledRef = useRef(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const handleScan = async (qrcode: string) => {
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
        <QrScanner className="h-full w-full" handleScan={handleScan} />
      </CameraViewfinder>

      <ResultSheet
        result={result}
        isOpen={state === 'result'}
        onClose={handleReset}
      />
    </>
  );
}
