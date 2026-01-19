'use client';

import { useEffect, useState } from 'react';
import HospitalTable from './HospitalTable';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// ------------------------
// Patient Info Dialog
// ------------------------
function PatientInfoDialog({
  patient,
  onClose,
}: {
  patient: any;
  onClose: () => void;
}) {
  if (!patient) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl z-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Patient Info
          </h2>

          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <span className="font-medium">Name:</span>{' '}
              {patient.patient_first_name} {patient.patient_last_name}
            </div>
            <div>
              <span className="font-medium">Doctor:</span>{' '}
              Dr. {patient.doctor_first_name} {patient.doctor_last_name}
            </div>
            <div>
              <span className="font-medium">Insurance:</span> {patient.insurance}
            </div>
            <div>
              <span className="font-medium">DOB:</span>{' '}
              {new Date(patient.date_of_birth).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{' '}
              {patient.patient_phone_number}
            </div>
            <div>
              <span className="font-medium">Email:</span> {patient.email}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              {patient.patient_status}
            </div>
          </div>

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

// ------------------------
// Types
// ------------------------
type Patient = {
  doctor_id: string;
  doctor_first_name: string;
  doctor_last_name: string;
  patient_id: string;
  patient_first_name: string;
  patient_last_name: string;
  insurance: string;
  date_of_birth: string;
  score: number | null;
  patient_phone_number: string;
  email: string;
  patient_status: string;
  created_at: string;
};

// ------------------------
// Patient Table Component
// ------------------------
export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showPatientInfo, setShowPatientInfo] = useState<Patient | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await fetch('/api/patients/getPatients/');
        const data = await res.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error('Failed to load patients', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading patients…</div>;
  }

  return (
    <>
      {/* ---------------- Layout Container ---------------- */}
      <div
        className={`flex gap-6 transition-all duration-300 ease-in-out ${
          selectedPatientId ? 'flex-row' : 'flex-col'
        }`}
      >
        {/* ---------------- Patient Table ---------------- */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            selectedPatientId ? 'w-1/2' : 'w-full'
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Insurance</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {patients.map((p) => (
                  <tr
                    key={p.patient_id}
                    onClick={() =>
                      setSelectedPatientId((prev) =>
                        prev === p.patient_id ? null : p.patient_id
                      )
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div
                        className="relative w-10 h-10 flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPatientInfo(p);
                        }}
                      >
                        <Image
                          src="/profile.png"
                          alt="Profile"
                          fill
                          className="rounded-full object-cover border border-gray-200"
                        />
                      </div>

                      <div>
                        <div className="font-medium text-gray-900">
                          {p.patient_first_name} {p.patient_last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Dr. {p.doctor_first_name} {p.doctor_last_name}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{p.patient_phone_number}</td>
                    <td className="px-4 py-3">{p.insurance}</td>
                    <td className="px-4 py-3">{p.score ?? '-'}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {p.patient_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------------- Hospital Table ---------------- */}
        <AnimatePresence>
          {selectedPatientId && (
            <motion.div
              className="w-1/2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Hospitals
                </h2>
                <button
                  onClick={() => setSelectedPatientId(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              <HospitalTable patientId={selectedPatientId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- Patient Info Dialog ---------------- */}
      {showPatientInfo && (
        <PatientInfoDialog
          patient={showPatientInfo}
          onClose={() => setShowPatientInfo(null)}
        />
      )}
    </>
  );
}
