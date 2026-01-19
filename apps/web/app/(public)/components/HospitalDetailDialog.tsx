'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Hospital = {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_phone_number: string;
  ranking: number;
  call_status: string; // e.g., 'Pending' | 'Rejected' | 'Accepted'
};

type Appointment = {
  audioUrl: string;
  transcription: string;
  patientName: string;
  doctorName: string;
  location: string;
  status: string; // e.g., 'Completed', 'Pending', etc.
  appointmentDate: string; // ISO string
  appointmentTime: string; // e.g., "2:30 PM"
};

export default function CombinedAppointmentDialog({
  appointment,
  hospital,
  onClose,
}: {
  appointment: Appointment | null;
  hospital: Hospital | null;
  onClose: () => void;
}) {
  if (!appointment || !hospital) return null;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    hospital.hospital_address
  )}&output=embed`;

  // Helper to map call_status / appointment status to Tailwind color
  function getStatusColor(status: string) {
    switch (status.trim().toLowerCase()) {
      case 'pending':
        return 'bg-yellow-400';
      case 'rejected':
        return 'bg-red-500';
      case 'accepted':
        return 'bg-green-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  }

  // Capitalized tooltip
  function normalizeStatusText(status: string) {
    const s = status.trim().toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

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
          className="relative w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment & Provider Details
            </h2>
            <p className="text-sm text-gray-500">
              Review appointment recording and provider info
            </p>
          </div>

          {/* Split Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Provider / Hospital */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Provider Info */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <Info label="Provider Name" value={hospital.hospital_name} />
                <Info label="Address" value={hospital.hospital_address} />
                <Info label="Phone" value={hospital.hospital_phone_number} />
                <Info label="Ranking" value={hospital.ranking.toString()} />
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded-full ${getStatusColor(
                      hospital.call_status
                    )}`}
                    title={normalizeStatusText(hospital.call_status)}
                  />
                  <span className="text-sm text-gray-900 font-medium">Call Status</span>
                </div>
              </div>

              {/* Map */}
              <div className="overflow-hidden rounded-xl border mt-2 flex-1">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="250"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Appointment */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Audio */}
              <div>
                <audio
                  controls
                  src={appointment.audioUrl}
                  className="w-full rounded-lg border border-gray-300"
                />
              </div>

              {/* Transcription */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Transcription
                </h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 max-h-48 overflow-y-auto">
                  {appointment.transcription}
                </div>
              </div>

              {/* Key Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Info label="Patient" value={appointment.patientName} />
                <Info label="Doctor" value={appointment.doctorName} />
                <Info label="Location" value={appointment.location} />
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded-full ${getStatusColor(
                      appointment.status
                    )}`}
                    title={normalizeStatusText(appointment.status)}
                  />
                  <span className="text-sm text-gray-900 font-medium">Status</span>
                </div>
              </div>

              {/* Appointment Date/Time */}
              <div className="mt-2 text-sm text-gray-700">
                <div className="font-medium">Appointment</div>
                <div>
                  {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                  {appointment.appointmentTime}
                </div>
              </div>
            </div>
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
