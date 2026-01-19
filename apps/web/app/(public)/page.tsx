'use client';

import React, { useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import SideNav from './components/SideNav';
import PatientTable from '../(public)/components/PatientTable';
import CreatePatientDialog from './components/CreatePatientDialog';
import AppointmentDetailDialog from './components/AppointmentDetailDialog';

export default function DashboardPage() {
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ----------------------------- */}
      {/* Side Navigation */}
      {/* ----------------------------- */}
      <SideNav setOpenPatientDialog={setOpenPatientDialog} />

      {/* ----------------------------- */}
      {/* Main Content Area */}
      {/* ----------------------------- */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <PatientTable />

          {/* Optional: appointment dialog trigger can live elsewhere later */}
          {openAppointmentDialog && (
            <AppointmentDetailDialog
              appointment={{
                audioUrl: '/mock-audio.mp3',
                transcription:
                  'Hello, this is a test transcription of the appointment recording.',
                patientName: 'Jane Doe',
                doctorName: 'Dr. John Smith',
                location: "Saint Peter's Hospital, Room 203",
                status: 'Completed',
                appointmentDate: '2026-01-18',
                appointmentTime: '2:30 PM',
              }}
              onClose={() => setOpenAppointmentDialog(false)}
            />
          )}
        </main>
      </div>

      {/* ----------------------------- */}
      {/* Global Dialogs */}
      {/* ----------------------------- */}
      <CreatePatientDialog
        open={openPatientDialog}
        onClose={() => setOpenPatientDialog(false)}
      />
    </div>
  );
}
