'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Cross } from 'lucide-react';
import { ScanResult } from '../domain/scanner-result';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Drawer } from 'vaul';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type ResultSheetProps = {
  result: ScanResult | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ResultSheet({ result, isOpen, onClose }: ResultSheetProps) {
  if (!result) return null;

  return SheetImpl({ result, isOpen, onClose });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VaultImpl({ result, isOpen, onClose }: ResultSheetProps) {
  if (!result) return null;
  return (
    <Drawer.Root open={isOpen} modal={false} onClose={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 h-fit flex-col rounded-t-[10px] bg-white pb-4 outline-none">
          <Drawer.Handle className="mb-4 mt-4" />
          <Drawer.Title />
          <Drawer.Description />
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
            {result.success ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <ErrorIcon />
            )}
            <h3 className="text-xl font-semibold">{result.message}</h3>
            {result.code && (
              <p className="text-sm text-muted-foreground">
                Code: {result.code}
              </p>
            )}
            <Button onClick={onClose} className="mt-4 w-full">
              OK
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function ErrorIcon() {
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-destructive">
      <Cross className="size-9 rotate-45 text-white" fill="white" />
    </div>
  );
}

function SheetImpl({ result, isOpen, onClose }: ResultSheetProps) {
  if (!result) return null;
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="flex min-h-[40vh] flex-col rounded-t-2xl"
      >
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>QR Code Result</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <div className="flex h-full flex-grow flex-col items-center justify-between text-center">
          <div className="flex flex-col items-center gap-4">
            {result.success ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <ErrorIcon />
            )}
            <h3 className="text-xl font-semibold">{result.message}</h3>
            {result.code && (
              <p className="text-sm text-muted-foreground">
                Code: {result.code}
              </p>
            )}
          </div>

          <Button onClick={onClose} className="mt-4 w-full self-end">
            OK
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
