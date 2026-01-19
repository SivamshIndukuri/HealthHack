'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Hospital = {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_phone_number: string;
  ranking: number;
  call_status: string;
};

export default function HospitalDetailDialog({
  hospital,
  onClose,
}: {
  hospital: Hospital | null;
  onClose: () => void;
}) {
  if (!hospital) return null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    hospital.hospital_address
  )}&output=embed`;

  return (
    <AnimatePresence>
      {hospital && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Backdrop fade matches CreatePatientDialog
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }} // Slide down + fade out matches others
            transition={{ duration: 0.2, ease: 'easeInOut' }} // smooth timing
          >
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {hospital.hospital_name}
              </h2>
              <p className="text-sm text-gray-500">Provider Details</p>
            </div>

            {/* Info */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
              <Info label="Address" value={hospital.hospital_address} />
              <Info label="Phone" value={hospital.hospital_phone_number} />
              <Info label="Ranking" value={hospital.ranking.toString()} />
              <Info label="Call Status" value={hospital.call_status} />
            </div>

            {/* Map */}
            <div className="mb-6 overflow-hidden rounded-xl border">
              <iframe
                src={mapSrc}
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}
