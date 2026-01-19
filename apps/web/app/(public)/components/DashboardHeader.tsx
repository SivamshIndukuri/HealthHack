'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

export default function DashboardHeader() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white shadow-sm border-b border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative w-40 h-15">
            <Image
              src="/svgviewer-png-output.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <SearchBar placeholder="Search patients, hospitals…" />
        </div>

        {/* Login/Profile Button */}
        <button
          onClick={() => setShowLoginDialog(true)}
          className="relative w-12 h-12 flex-shrink-0"
        >
          <Image
            src="/login.png"
            alt="Profile"
            fill
            className="rounded-full object-cover border border-gray-200"
          />
        </button>
      </header>

      {/* Login Dialog */}
      <AnimatePresence>
        {showLoginDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowLoginDialog(false)}
            />

            {/* Dialog */}
            <motion.div
              className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl z-10 flex flex-col items-center gap-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="relative w-28 h-28">
                <Image
                  src="/login.png"
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border border-gray-200"
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => alert('Log out clicked')}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Log Out
                </button>
                <button
                  onClick={() => alert('Account settings clicked')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setShowLoginDialog(false)}
                  className="w-full rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
