'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type CreatePatientContextType = {
  isOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
};

const CreatePatientContext = createContext<CreatePatientContextType | undefined>(undefined);

export function CreatePatientProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCreateDialog = () => setIsOpen(true);
  const closeCreateDialog = () => setIsOpen(false);

  return (
    <CreatePatientContext.Provider value={{ isOpen, openCreateDialog, closeCreateDialog }}>
      {children}
    </CreatePatientContext.Provider>
  );
}

export function useCreatePatient() {
  const context = useContext(CreatePatientContext);
  if (!context) throw new Error('useCreatePatient must be used within CreatePatientProvider');
  return context;
}
