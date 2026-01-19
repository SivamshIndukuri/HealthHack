'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function SideNav({
  setOpenPatientDialog,
}: {
  setOpenPatientDialog: (open: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        flex flex-col
        ${collapsed ? 'w-16' : 'w-44'}
        transition-[width] duration-300 ease-in-out
        bg-blue-50
        border-r border-blue-100
        h-screen
        px-2 py-4
        gap-3
      `}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center rounded-md p-2 hover:bg-blue-100 transition"
      >
        <Image
          src="/close.png"
          alt="Toggle"
          width={32}
          height={32}
          className={`
            w-5 h-5
            transition-transform duration-300 ease-in-out
            ${collapsed ? 'rotate-180' : 'rotate-0'}
            opacity-70
          `}
        />
      </button>

      {/* Divider */}
      <div className="h-px bg-blue-100 my-1" />

      {/* Create Patient Button */}
      <button
        onClick={() => setOpenPatientDialog(true)}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition overflow-hidden"
      >
        <Image
          src="/create.png"
          alt="Create"
          width={32}
          height={32}
          className="w-5 h-5"
        />
        <span
          className={`
            whitespace-nowrap
            transition-all duration-200
            ${collapsed ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
          `}
        >
          Create Patient
        </span>
      </button>

      {/* Active Button */}
      <button
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 transition overflow-hidden"
      >
        <Image
          src="/active.png"
          alt="Active"
          width={32}
          height={32}
          className="w-5 h-5"
        />
        <span
          className={`
            whitespace-nowrap
            transition-all duration-200
            ${collapsed ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
          `}
        >
          Active
        </span>
      </button>

      {/* Archived Button */}
      <button
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-100 transition overflow-hidden"
      >
        <Image
          src="/archive.png"
          alt="Archived"
          width={32}
          height={32}
          className="w-5 h-5"
        />
        <span
          className={`
            whitespace-nowrap
            transition-all duration-200
            ${collapsed ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
          `}
        >
          Archived
        </span>
      </button>
    </div>
  );
}
