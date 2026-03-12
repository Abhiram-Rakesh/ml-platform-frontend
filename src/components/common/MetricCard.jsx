import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './Card';

export function MetricCard({ title, value, trend, trendLabel, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const isPositiveTrend = trend === 'up';
  const isNeutral = !trend;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {trendLabel && (
            <div className={`flex items-center mt-2 text-sm ${
              isNeutral ? 'text-gray-500' : isPositiveTrend ? 'text-green-600' : 'text-green-600'
            }`}>
              {trend === 'up' && <ArrowUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
