import { cn } from '@/lib/utils';

type QrScannerProps = React.HTMLAttributes<HTMLVideoElement>;

export function QrScanner({ className, ...props }: QrScannerProps) {
  return <div className={cn('size-11 bg-green-300', className)} />;
}
