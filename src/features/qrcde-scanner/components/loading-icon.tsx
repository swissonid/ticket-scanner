import { LoaderCircle } from 'lucide-react';

export function LoadingIcon() {
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-primary">
      <LoaderCircle className="size-9 animate-spin text-white" />
    </div>
  );
}
