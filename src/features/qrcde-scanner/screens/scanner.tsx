'use client';

import { useState, useRef, useTransition, useEffect } from 'react';

import { CameraViewfinder } from '../components/camera-finder';
import { ResultSheet } from '../components/result-sheet';
import QrScanner from '../components/qr-scanner';
import { AudioSwitch } from '../components/audio-switch';
import { IScannerControls } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { LoadingIcon } from '../components/loading-icon';
import {
  isVoucherValid,
  VoucherValidateState,
} from '../actions/qrcode.server-actions';
import { useRouter } from 'next/navigation';
import { ErrorIcon } from '../components/error-icon';

export type ScannerState = 'ready' | 'scanning' | 'result' | 'error';

export function Scanner() {
  const audioEnabledRef = useRef(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const controllerRef = useRef<IScannerControls | null>(null);
  const qrScannerRef = useRef<{
    startScanning: () => void;
    stopScanning: () => void;
  }>(null);
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const isScanning = useRef<boolean>(true);
  const [result, setResult] = useState<VoucherValidateState | null>(null);

  const handleScan = (qrcode: string, scannerController?: IScannerControls) => {
    controllerRef.current = scannerController ?? null;
    isScanning.current = false;
    playAudio();
    const voucher = {
      message: 'A voucher',
      code: qrcode,
    };
    startTransaction(async () => {
      console.log(`Started transaction for ${qrcode} `);
      const result = await isVoucherValid({
        voucher: voucher,
      });

      restartScanner();
      console.log(`Got from backend ${JSON.stringify(result, null, 2)}`);
      setResult(result);
    });
  };

  useEffect(() => {
    console.log('Success go to the movies!!!!');
    if (result?.isValid) {
      router.push(`/movies?voucherid=${result.voucher.code}`);
    }
  }, [result]);

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

  const restartScanner = () => {
    console.log(`qrSacnnerRef: ${JSON.stringify(qrScannerRef, null, 2)}`);
    if (qrScannerRef.current !== null && isScanning.current === false) {
      console.log('Try to restart scanner');
      isScanning.current = true;
      qrScannerRef.current.startScanning();
    }
  };

  const voucherHasError = (
    voucherValidateState: VoucherValidateState | undefined | null
  ) => {
    if (!voucherValidateState) return false;
    return voucherValidateState.showError ?? false;
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

      <ResultSheet isOpen={isPending}>
        <VoucherIsCheckingContent />
      </ResultSheet>

      <ResultSheet
        isOpen={voucherHasError(result)}
        onClose={() => setResult(null)}
      >
        <VoucherHasError
          voucherValidateState={result}
          onOkClicked={() => setResult(null)}
        />
      </ResultSheet>
    </>
  );
}

function VoucherIsCheckingContent() {
  return (
    <div className="flex h-full flex-grow flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-11 pt-8">
        <LoadingIcon />
        <h4 className="text-xl font-bold">Gutschein wird überprüft</h4>
      </div>
      <Button disabled className="w-full">
        Ok
      </Button>
    </div>
  );
}

function VoucherHasError({
  voucherValidateState,
  onOkClicked,
}: {
  voucherValidateState: VoucherValidateState | undefined | null;
  onOkClicked?: () => void;
}) {
  if (!voucherValidateState) return null;
  const { errorMessage } = voucherValidateState;
  return (
    <div className="flex h-full flex-grow flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-11 pt-8">
        <ErrorIcon />
        <h4 className="text-xl font-bold">
          {errorMessage ?? 'Unbekannter Fehler aufgetreten'}
        </h4>
      </div>
      <Button className="w-full" onClick={onOkClicked}>
        Ok
      </Button>
    </div>
  );
}
