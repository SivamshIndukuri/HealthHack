'use client';

import { useEffect, useState } from 'react';
import HospitalDetailDialog from './HospitalDetailDialog';

type Hospital = {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_phone_number: string;
  ranking: number;
  call_status: string;
};

export default function HospitalTable({ patientId }: { patientId: string }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hospital | null>(null);

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch('/api/hospital/getHospital/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId }),
        });

        const data = await res.json();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error('Failed to load hospitals', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, [patientId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading providers…</div>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Ranking</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {hospitals.map((h) => (
              <tr
                key={h.hospital_id}
                onClick={() => setSelected(h)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {h.hospital_name}
                  <div className="text-xs text-gray-500">
                    {h.hospital_address}
                  </div>
                </td>
                <td className="px-4 py-3">{h.hospital_phone_number}</td>
                <td className="px-4 py-3">{h.ranking}</td>
                <td className="px-4 py-3 capitalize text-gray-600">
                  {h.call_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HospitalDetailDialog
        hospital={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
