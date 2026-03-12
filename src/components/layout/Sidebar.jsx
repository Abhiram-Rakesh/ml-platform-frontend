import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Server,
  Key,
  CreditCard,
  Settings,
  Cpu,
  LogOut,
} from 'lucide-react';
import { APP_NAME } from '@/utils/constants';

const iconMap = {
  LayoutDashboard,
  Box,
  Server,
  Key,
  CreditCard,
  Settings,
};

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/models', label: 'Models', icon: 'Box' },
  { path: '/deployments', label: 'Deployments', icon: 'Server' },
  { path: '/api-keys', label: 'API Keys', icon: 'Key' },
  { path: '/billing', label: 'Billing', icon: 'CreditCard' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-30">
      <div
        className="flex items-center gap-2 px-6 h-16 border-b border-gray-200 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <Cpu className="w-7 h-7 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">{APP_NAME}</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@company.com</p>
          </div>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            onClick={() => navigate('/')}
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
