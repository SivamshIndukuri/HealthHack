'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Appointment = {
  audioUrl: string;
  transcription: string;
  patientName: string;
  doctorName: string;
  location: string;
  status: string;
  appointmentDate: string; // ISO string
  appointmentTime: string; // e.g., "2:30 PM"
};

export default function AppointmentDetailDialog({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
  onClose: () => void;
}) {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        {/* Dialog */}
        <motion.div
          className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment Details
            </h2>
            <p className="text-sm text-gray-500">
              Review recording and details
            </p>
          </div>

          {/* Audio */}
          <div className="mb-6">
            <audio
              controls
              src={appointment.audioUrl}
              className="w-full rounded-lg border border-gray-300"
            />
          </div>

          {/* Transcription */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Transcription</h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 max-h-48 overflow-y-auto">
              {appointment.transcription}
            </div>
          </div>

          {/* Key Details */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Info label="Patient" value={appointment.patientName} />
            <Info label="Doctor" value={appointment.doctorName} />
            <Info label="Location" value={appointment.location} />
            <Info label="Status" value={appointment.status} />
          </div>

          {/* Appointment Time */}
          <div className="mt-6 text-sm text-gray-700">
            <div className="font-medium">Appointment</div>
            <div>{new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}</div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
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
