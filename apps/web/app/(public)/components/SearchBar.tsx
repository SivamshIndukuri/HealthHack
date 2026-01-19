'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchBar({
  placeholder = 'Search...',
}: {
  placeholder?: string;
}) {
  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-12
          py-3
          text-sm
          text-gray-900
          placeholder-gray-400
          shadow-sm
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-500
          focus:outline-none
          transition
        "
      />

      {/* Icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
