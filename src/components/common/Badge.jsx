import React from 'react';

const variantStyles = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
};

export function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const config = {
    running: { variant: 'success', label: 'Running' },
    pending: { variant: 'warning', label: 'Pending' },
    stopped: { variant: 'neutral', label: 'Stopped' },
    failed: { variant: 'error', label: 'Failed' },
  };
  const { variant, label } = config[status] || config.stopped;
  return (
    <Badge variant={variant}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'running' ? 'bg-green-500' :
        status === 'pending' ? 'bg-yellow-500' :
        status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
      }`} />
      {label}
    </Badge>
  );
}
