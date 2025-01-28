import { Cross } from 'lucide-react';

export function ErrorIcon() {
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-destructive">
      <Cross className="size-9 rotate-45 text-white" fill="white" />
    </div>
  );
}
