'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SideNav({
  setOpenPatientDialog,
}: {
  setOpenPatientDialog: (open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const buttonBg = 'bg-blue-100'; // soft pastel blue
  const buttonHover = 'hover:bg-blue-200';

  return (
    <div
      className={`flex flex-col ${
        collapsed ? 'w-20' : 'w-60'
      } transition-all duration-300 bg-white border-r border-gray-200 h-screen p-4 gap-4 shadow-sm`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`flex items-center justify-center rounded-lg p-2 ${buttonBg} ${buttonHover}`}
      >
        <Image src="/options.png" alt="Toggle" width={24} height={24} />
      </button>

      {/* Create Patient Button */}
      <button
        onClick={() => setOpenPatientDialog(true)}
        className={`flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 transition`}
      >
        <Image src="/current.png" alt="Create" width={24} height={24} />
        {!collapsed && 'Create Patient'}
      </button>

      {/* Active Button */}
      <button
        className={`flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 ${buttonBg} ${buttonHover} transition`}
      >
        <Image src="/current.png" alt="Active" width={24} height={24} />
        {!collapsed && 'Active'}
      </button>

      {/* Archived Button */}
      <button
        className={`flex items-center gap-3 rounded-lg px-4 py-2 font-medium text-gray-900 ${buttonBg} ${buttonHover} transition`}
      >
        <Image src="/archive.png" alt="Archived" width={24} height={24} />
        {!collapsed && 'Archived'}
      </button>
    </div>
  );
}
