'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ScanResult } from '../domain/scanner-result';
import { CameraViewfinder } from '../components/camera-finder';
import { ResultSheet } from '../components/result-sheet';
import { QrScanner } from '../components/qr-scanner';
import { provideFeedback } from '@/lib/feedback';

export type ScannerState = 'ready' | 'scanning' | 'result' | 'error';

export function Scanner() {
  const [state, setState] = useState<ScannerState>('ready');
  const [result, setResult] = useState<ScanResult | null>(null);

  // Simulate scanning process
  const handleScan = async () => {
    setState('scanning');
    provideFeedback();
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/error
    const success = Math.random() > 0.5;
    setResult({
      success,
      message: success
        ? 'QR code scanned successfully'
        : 'This code has already been used',
      code: success ? 'QR123456' : undefined,
    });
    setState('result');
  };

  const handleReset = () => {
    setState('ready');
    setResult(null);
  };

  return (
    <>
      <CameraViewfinder>
        <QrScanner className="h-full w-full" />
      </CameraViewfinder>

      <ResultSheet
        result={result}
        isOpen={state === 'result'}
        onClose={handleReset}
      />

      {/* Temporary scan trigger for demo */}
      {state === 'ready' && (
        <button
          onClick={handleScan}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-black px-4 py-2 text-white"
        >
          Simulate Scan
        </button>
      )}
    </>
  );
}
