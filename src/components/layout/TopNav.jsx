import React, { useState } from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopNav({ breadcrumbs = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, text: 'Deployment llama2-prod scaled to 2 replicas', time: '2h ago' },
    { id: 2, text: 'API key prod-key-v2 was generated', time: '5h ago' },
    { id: 3, text: 'Deployment mistral-prod failed: OOM error', time: '1d ago' },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center text-sm text-gray-500">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
            {crumb.path ? (
              <button
                onClick={() => navigate(crumb.path)}
                className="hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-gray-900 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
