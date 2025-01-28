'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Cross } from 'lucide-react';
import { Voucher } from '../domain/scanner-result';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Drawer } from 'vaul';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';

type ResultSheetProps = {
  children?: ReactNode;

  isOpen: boolean;
  acccessibilityLabel?: string;
  acccessibilityContentDescription?: string;
  onClose: () => void;
};

export function ResultSheet({
  children,

  isOpen,
  onClose,
  acccessibilityLabel,
  acccessibilityContentDescription,
}: ResultSheetProps) {
  return SheetImpl({
    children,

    isOpen,
    onClose,
    acccessibilityLabel,
    acccessibilityContentDescription,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VaultImpl({ isOpen, onClose, children }: ResultSheetProps) {
  return (
    <Drawer.Root open={isOpen} modal={false} onClose={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 h-fit flex-col rounded-t-[10px] bg-white pb-4 outline-none">
          <Drawer.Handle className="mb-4 mt-4" />
          <Drawer.Title />
          <Drawer.Description />
          {children}
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

function SheetImpl({
  children,
  isOpen,
  onClose,
  acccessibilityLabel,
  acccessibilityContentDescription,
}: ResultSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="flex min-h-[40vh] flex-col rounded-t-2xl"
      >
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>{acccessibilityLabel}</SheetTitle>
            <SheetDescription>
              {acccessibilityContentDescription}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
