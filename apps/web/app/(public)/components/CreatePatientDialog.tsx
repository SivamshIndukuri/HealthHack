'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export type CreatePatientDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreate: (patient: {
    name: string;
    address: string;
    insurance: string;
    phone: string;
  }) => void;
};

export default function CreatePatientDialog({
  isOpen,
  setIsOpen,
  onCreate,
}: CreatePatientDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [insurance, setInsurance] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    onCreate({ name, address, insurance, phone });
    setName('');
    setAddress('');
    setInsurance('');
    setPhone('');
    setIsOpen(false);
  };

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
                <Dialog.Title className="text-xl font-bold mb-4">Create Patient</Dialog.Title>

                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Insurance Type"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create
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
