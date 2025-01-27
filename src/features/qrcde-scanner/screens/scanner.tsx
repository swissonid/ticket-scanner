'use client';

import { useState } from 'react';
import { ScanResult } from '../domain/scanner-result';
import { CameraViewfinder } from '../components/camera-finder';
import { ResultSheet } from '../components/result-sheet';
import { QrScanner } from '../components/qr-scanner';
import { AudioSwitch } from '../components/audio-switch';

export type ScannerState = 'ready' | 'scanning' | 'result' | 'error';

export function Scanner() {
  const [state, setState] = useState<ScannerState>('ready');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  // Simulate scanning process
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
    setAudioEnabled(isEnabled);
    if (isEnabled) {
      audioElement.play();
      setAudioElement(audioElement);
    } else {
      setAudioElement(null);
    }
  };

  const playAudio = () => {
    if (audioElement) {
      audioElement.play();
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
          <AudioSwitch onChange={handleAudioSwitch} isEnable={audioEnabled} />
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
