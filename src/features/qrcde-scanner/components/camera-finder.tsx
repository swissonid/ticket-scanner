import { QrCode } from 'lucide-react';

interface CameraViewfinderProps {
  children?: React.ReactNode;
}

export function CameraViewfinder({ children }: CameraViewfinderProps) {
  return (
    <div className="relative h-full min-h-screen w-full bg-gray-100">
      <div className="absolute inset-0 h-full w-full">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center">
        <InfoBanner />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <CameraFinder />
      </div>
    </div>
  );
}

function CameraFinder() {
  return (
    <div className="aspect-square w-full rounded-3xl border-[2px] border-white" />
  );
}

function InfoBanner() {
  return (
    <div className="mt-8 w-full max-w-md p-4">
      <div className="flex h-[4.5rem] items-center gap-3 rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
        <QrCode className="size-6 flex-shrink-0" />
        <p className="text-sm">
          Scanne den QR-Code auf dem Gutschein um ihn den Entwertungsprozess zu
          beginnen
        </p>
      </div>
    </div>
  );
}
