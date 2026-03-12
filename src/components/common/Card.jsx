import React from 'react';

export function Card({ children, className = '', hover = false, onClick, padding = 'p-6' }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${padding} ${
        hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
