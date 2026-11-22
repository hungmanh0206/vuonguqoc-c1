'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps } from 'react';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({ children, ...props }: Omit<ComponentProps<typeof Dialog.Content>, 'className'>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="sheet-overlay" />
      <Dialog.Content className="sheet-content" {...props}>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function SheetClose({ label }: { label: string }) {
  return (
    <Dialog.Close className="control icon-control" type="button" aria-label={label}>
      <X aria-hidden="true" />
    </Dialog.Close>
  );
}
