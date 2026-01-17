'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Doctor = {
    id: number;
    name: string;
    specialty: string;
    placeId: string;
};

type Props = {
    doctor: Doctor | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export default function DoctorDialog({ doctor, isOpen, setIsOpen }: Props) {
    if (!doctor) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
                <div className="fixed inset-0 bg-black/40" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-4 border-b">
                            <Dialog.Title className="text-lg font-bold">
                                {doctor.name}
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>

                        {/* Google Maps Embed */}
                        <iframe
                            className="w-full h-[400px]"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                doctor.name
                            )}&output=embed`}
                        />

                        <div className="p-4 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
