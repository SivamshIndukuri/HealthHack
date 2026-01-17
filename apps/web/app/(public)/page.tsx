'use client';

import { useState } from 'react';
import { InformationCircleIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePatientDialog from './components/CreatePatientDialog';
import PatientDialog from './components/PatientDialog';
import DoctorDialog from './components/DoctorDialog';
import { useCreatePatient } from './components/CreatePatientContext';

type Patient = { id: number; name: string; status: string; createdAt?: string };
type Provider = {
  id: number;
  name: string;
  specialty: string;
  placeId: string;
  status: 'red' | 'orange' | 'green';
};

export default function LandingPage() {
  const { isOpen: isCreateDialogOpen, closeCreateDialog } = useCreatePatient();

  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: 'John Doe', status: 'Active', createdAt: '2026-01-01' },
    { id: 2, name: 'Jane Smith', status: 'Archived', createdAt: '2026-01-05' },
    { id: 3, name: 'Bob Johnson', status: 'Active', createdAt: '2026-01-08' },
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showProviders, setShowProviders] = useState(false);
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const providers: Provider[] = [
    { id: 1, name: 'Dr. Emily Carter', specialty: 'Psychiatry', placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', status: 'green' },
    { id: 2, name: 'Dr. Michael Lee', specialty: 'Primary Care', placeId: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM', status: 'orange' },
    { id: 3, name: 'Dr. Sarah Patel', specialty: 'Therapy', placeId: 'ChIJLfySpTOuEmsRsc_JfJtljdc', status: 'red' },
  ];

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowProviders(true);
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsProviderDialogOpen(true);
  };

  const handleCreatePatient = (newPatient: { name: string; address: string; insurance: string; phone: string }) => {
    setPatients((prev) => [
      ...prev,
      { id: prev.length + 1, name: newPatient.name, status: 'Active', createdAt: new Date().toISOString().split('T')[0] },
    ]);
    closeCreateDialog();
  };

  const getStatusColor = (status: 'red' | 'orange' | 'green') => {
    switch (status) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
    }
  };

  // Apply filters
  const filteredPatients = patients.filter((p) => {
    if (filterStatus && p.status !== filterStatus) return false;
    if (filterDate && p.createdAt && p.createdAt !== filterDate) return false;
    return true;
  });

  return (
    <>
      {/* Filter button above table */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setIsFilterDialogOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          <FunnelIcon className="h-5 w-5" />
          Filter
        </button>
      </div>

      <div className={`grid gap-6 transition-all ${showProviders ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {/* Patients Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-purple-200"
        >
          <table className="min-w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPatients.map((p) => (
                <motion.tr
                  key={p.id}
                  onClick={() => handleRowClick(p)}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer transition hover:bg-purple-50"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className="text-gray-800">{p.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatient(p);
                        setIsPatientDialogOpen(true);
                      }}
                      className="text-purple-400 hover:text-purple-600 transition"
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Providers Panel */}
        <AnimatePresence>
          {showProviders && selectedPatient && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white rounded-2xl shadow-md p-4 border border-purple-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-purple-900">
                  Providers for {selectedPatient.name}
                </h3>
                <button
                  onClick={() => setShowProviders(false)}
                  className="text-gray-400 hover:text-purple-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <table className="min-w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase">Provider</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase">Specialty</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {providers.map((doc) => (
                    <motion.tr
                      key={doc.id}
                      onClick={() => handleProviderClick(doc)}
                      whileHover={{ scale: 1.01 }}
                      className="cursor-pointer hover:bg-purple-50 transition"
                    >
                      <td className="px-4 py-3">{doc.name}</td>
                      <td className="px-4 py-3">{doc.specialty}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(doc.status)}`} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dialogs */}
      <CreatePatientDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={closeCreateDialog}
        onCreate={handleCreatePatient}
      />

      <PatientDialog
        isOpen={isPatientDialogOpen}
        setIsOpen={setIsPatientDialogOpen}
        patient={selectedPatient}
      />

      <DoctorDialog
        doctor={selectedProvider}
        isOpen={isProviderDialogOpen}
        setIsOpen={setIsProviderDialogOpen}
      />

      {/* Filter Dialog */}
      <AnimatePresence>
        {isFilterDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 w-96"
            >
              <h2 className="text-lg font-bold text-purple-800 mb-4">Filter Patients</h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-purple-200 rounded-lg px-3 py-2 shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <input
                    type="date"
                    className="w-full border border-purple-200 rounded-lg px-3 py-2 shadow-sm"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsFilterDialogOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsFilterDialogOpen(false)}
                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
