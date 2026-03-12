import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function MainLayout({ children, breadcrumbs }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60">
        <TopNav breadcrumbs={breadcrumbs} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
