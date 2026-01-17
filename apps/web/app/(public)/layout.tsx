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
        animate={{ width: collapsed ? 72 : 224 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="bg-white/80 backdrop-blur shadow-lg flex flex-col justify-between p-4 gap-3 border-r border-purple-100 relative"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-purple-200 rounded-full p-1 shadow hover:bg-purple-50"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-purple-600" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-purple-600" />
          )}
        </button>

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

        {/* Account Icon at bottom */}
        <button
          onClick={() => setIsAccountDialogOpen(true)}
          className="text-purple-600 hover:text-purple-800 self-center transition"
        >
          <UserCircleIcon className="h-10 w-10" />
        </button>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Logo left, search right */}
        <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur shadow-md border-b border-purple-100">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Image
              src="/svgviewer-png-output.png"
              alt="Logo"
              width={600}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Search Input on the right */}
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
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${color} text-white rounded-lg shadow-md transition flex items-center gap-3 px-3 py-2 font-medium`}
    >
      {icon}
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </motion.button>
  );
}
