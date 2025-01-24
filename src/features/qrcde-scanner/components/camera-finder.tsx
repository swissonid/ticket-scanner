import { QrCode } from 'lucide-react';

interface CameraViewfinderProps {
  children?: React.ReactNode;
}

export function CameraViewfinder({ children }: CameraViewfinderProps) {
  return (
    <div className="relative h-full min-h-screen w-full bg-gray-100">
      <div className="absolute inset-0 flex flex-col items-center">
        <InfoBanner />
        <div className="flex w-full max-w-md flex-1 items-center justify-center px-4">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-0 rounded-3xl border-[2px] border-white" />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBanner() {
  return (
    <div className="mt-8 w-full max-w-md p-4">
      <div className="flex h-[4.5rem] items-center gap-3 rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
        <QrCode className="h-6 w-6 flex-shrink-0" />
        <p className="text-sm">
          Scanne den QR-Code auf dem Gutschein um ihn den Entwertungsprozess zu
          beginnen
        </p>
      </div>
    </div>
  );
}
