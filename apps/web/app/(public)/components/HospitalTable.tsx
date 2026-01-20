'use client';

import { useEffect, useState } from 'react';
import CombinedAppointmentDialog from './HospitalDetailDialog';

type Hospital = {
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_phone_number: string;
  ranking: number;
  call_status: string; // Keep string to allow API values
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

  // Mock appointment data (same as before)
  const mockAppointment = {
    audioUrl: '/mock-audio.mp3',
    transcription: "Uh, hi… thanks for picking up. I’m, um, just calling to help set up an appointment. Is this a good time?\n\
Yeah… that’s fine.\n\
Okay, great. So, uh, I just need to check a couple things real quick. Can you, um, tell me your date of birth and your insurance?\n\
Uh, sure — it’s January 14th, 1994, and, ah, I have Blue Cross PPO.\n\
Perfect, thanks! Um, we do accept that plan. The next available slot is, uh, Tuesday, January 23rd, at 2:30 in the afternoon. Would that, uh, work for you?\n\
Yeah, that should be fine.\n\
Great! So, um, it’ll be in person at our Main Street office. If you can, ah, try to arrive like 15 minutes early for check-in.\n\
Yeah, okay, no problem.\n\
Alright, um, you’re all set. I’ve scheduled it, and you should get a confirmation message with all the details soon. If anything comes up or you need to reschedule, all the info will be in there.\n\
Perfect, thanks so much.\n\
Of course! See you then."
    ,
    patientName: 'Roopa Patty',
    doctorName: 'Dr. John Smith',
    location: "A New Way Counseling and Psychotherapy LLC",
    status: 'Completed',
    appointmentDate: '2026-01-18',
    appointmentTime: '2:30 PM',
    patientStatus: 'To Visit Provider'
  };

  // Helper to map call_status to Tailwind color
  function getStatusColor(status: string) {
    switch (status.trim().toLowerCase()) {
      case 'pending':
        return 'bg-yellow-400';
      case 'rejected':
        return 'bg-red-500';
      case 'accepted':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  }

  // Helper to normalize tooltip text
  function normalizeStatusText(status: string) {
    const s = status.trim().toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Rating</th>
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
                  <div className="text-xs text-gray-500">{h.hospital_address}</div>
                </td>
                <td className="px-4 py-3">{h.hospital_phone_number}</td>
                <td className="px-4 py-3">{h.ranking}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded-full align-middle ml-1 ${getStatusColor(
                      h.call_status
                    )}`}
                    title={normalizeStatusText(h.call_status)} // Capitalized tooltip
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <CombinedAppointmentDialog
          hospital={selected}
          appointment={mockAppointment}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
