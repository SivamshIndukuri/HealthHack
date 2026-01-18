'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Patient = {
  id: number;
  name: string;
  status: string;
};

type PatientDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  patient: Patient | null;
};

export default function PatientDialog({ isOpen, setIsOpen, patient }: PatientDialogProps) {
  if (!patient) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <Dialog.Title className="text-xl font-bold mb-4">
                  Patient Details
                </Dialog.Title>

                <div className="flex flex-col gap-3">
                  <p>
                    <strong>Name:</strong> {patient.name}
                  </p>
                  <p>
                    <strong>Status:</strong> {patient.status}
                  </p>
                  {/* You can add more details here (address, phone, insurance, etc.) */}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
