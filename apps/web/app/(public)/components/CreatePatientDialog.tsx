'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreatePatientDialog({
  open,
  onClose,
  refreshPatients,
}: {
  open: boolean;
  onClose: () => void;
  refreshPatients?: () => void; // function to refresh table after creation
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    doctorFirstName: '',
    doctorLastName: '',
    patientFirstName: '',
    patientLastName: '',
    insurance: '',
    dateOfBirth: '',
    score: '',
    patientNumber: '',
    email: '',
    address: '',
    facilityType: '',
    radius: '',
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/patients/createPatients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          score: Number(form.score),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create patient');
      }

      const patientId = data.patientId;

      // Refresh the patient table after creation
      if (refreshPatients) {
        await refreshPatients();
      }

      // Optional: Call hospital find API
      await fetch('http://localhost:3000/api/hospital/findHospital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          address: form.address,
          query: form.facilityType || 'hospital',
          radius: Number(form.radius) || 5000,
        }),
      });

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Patient
              </h2>
              <p className="text-sm text-gray-500">
                Enter patient and provider details
              </p>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Doctor First Name"
                value={form.doctorFirstName}
                onChange={(v) => updateField('doctorFirstName', v)}
              />
              <Input
                label="Doctor Last Name"
                value={form.doctorLastName}
                onChange={(v) => updateField('doctorLastName', v)}
              />
              <Input
                label="Patient First Name"
                value={form.patientFirstName}
                onChange={(v) => updateField('patientFirstName', v)}
              />
              <Input
                label="Patient Last Name"
                value={form.patientLastName}
                onChange={(v) => updateField('patientLastName', v)}
              />
              <Input
                label="Insurance"
                value={form.insurance}
                onChange={(v) => updateField('insurance', v)}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(v) => updateField('dateOfBirth', v)}
              />
              <Input
                label="Assessment Score"
                type="number"
                value={form.score}
                onChange={(v) => updateField('score', v)}
              />
              <Input
                label="Patient Phone"
                value={form.patientNumber}
                onChange={(v) => updateField('patientNumber', v)}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => updateField('email', v)}
              />
              <Input
                label="Address"
                value={form.address}
                onChange={(v) => updateField('address', v)}
              />
              <Input
                label="Facility Type"
                value={form.facilityType}
                onChange={(v) => updateField('facilityType', v)}
              />
              <Input
                label="Radius (miles)"
                type="number"
                value={form.radius}
                onChange={(v) => updateField('radius', v)}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating…' : 'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
