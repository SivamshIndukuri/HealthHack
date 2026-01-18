'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  accountName?: string;
};

export default function AccountDialog({ isOpen, setIsOpen, accountName = 'Account 1' }: Props) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b">
              <Dialog.Title className="text-lg font-bold">{accountName}</Dialog.Title>
              <p className="text-sm text-gray-500">Account details and settings</p>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <button className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition">
                Switch Account
              </button>
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">
                Logout
              </button>
            </div>

            <div className="p-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
