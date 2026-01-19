// app/dashboard/layout.tsx

import React from 'react';

export const metadata = {
  title: 'Dashboard',
  description: 'Patient management dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: '#f3f4f6',
        }}
      >
        {children}
      </body>
    </html>
  );
}
