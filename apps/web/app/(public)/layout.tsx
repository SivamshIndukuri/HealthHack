'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { CreatePatientProvider, useCreatePatient } from './components/CreatePatientContext';
import AccountDialog from './components/AccountDialog';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <CreatePatientProvider>
      <LandingLayoutContent>{children}</LandingLayoutContent>
    </CreatePatientProvider>
  );
}

function LandingLayoutContent({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const { openCreateDialog } = useCreatePatient();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Side Nav */}
      <motion.nav
        initial={false}
        animate={{ width: collapsed ? 72 : 224 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 32,
          mass: 0.8,
        }}
        className="bg-white/80 backdrop-blur shadow-lg flex flex-col justify-between p-4 gap-3 border-r border-purple-100 relative overflow-hidden"
      >
        {/* Collapse Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.1 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-purple-200 rounded-full p-1 shadow hover:bg-purple-50"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-purple-600" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-purple-600" />
          )}
        </motion.button>

        {/* Nav Buttons */}
        <div className="flex flex-col gap-2">
          <NavButton
            label="Create"
            icon={<PlusIcon className="h-5 w-5" />}
            collapsed={collapsed}
            color="bg-purple-600 hover:bg-purple-700"
            onClick={openCreateDialog}
          />
          <NavButton
            label="Active"
            icon={<CheckCircleIcon className="h-5 w-5" />}
            collapsed={collapsed}
            color="bg-emerald-600 hover:bg-emerald-700"
          />
          <NavButton
            label="Archive"
            icon={<ArchiveBoxIcon className="h-5 w-5" />}
            collapsed={collapsed}
            color="bg-gray-600 hover:bg-gray-700"
          />
        </div>

        {/* Account Icon */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          onClick={() => setIsAccountDialogOpen(true)}
          className="text-purple-600 hover:text-purple-800 self-center transition"
        >
          <UserCircleIcon className="h-10 w-10" />
        </motion.button>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur shadow-md border-b border-purple-100">
          <div className="flex-shrink-0">
            <Image
              src="/svgviewer-png-output.png"
              alt="Logo"
              width={600}
              height={40}
              className="object-contain"
            />
          </div>

          <input
            type="text"
            placeholder="Search patients..."
            className="w-72 border border-purple-200 rounded-lg px-3 py-2 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </header>

        <main className="p-6 flex-1">{children}</main>
      </div>

      {/* Account Dialog */}
      <AccountDialog isOpen={isAccountDialogOpen} setIsOpen={setIsAccountDialogOpen} />
    </div>
  );
}

function NavButton({
  label,
  icon,
  collapsed,
  color,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  color: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      onClick={onClick}
      className={`${color} text-white rounded-lg shadow-md transition flex items-center gap-3 px-3 py-2 font-medium`}
    >
      {icon}

      <motion.span
        initial={false}
        animate={{
          opacity: collapsed ? 0 : 1,
          x: collapsed ? -8 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="whitespace-nowrap"
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
