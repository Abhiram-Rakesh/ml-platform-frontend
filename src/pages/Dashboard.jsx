import React from 'react';
import { Server, Activity, Clock, DollarSign, Plus, Key, Maximize2, Square, AlertTriangle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/common/MetricCard';
import { Card } from '@/components/common/Card';
import { LineChart } from '@/components/charts/LineChart';
import { requestsChartData, latencyChartData, recentActivity } from '@/data/deployments';

const iconMap = { Plus, Key, Maximize2, Square, AlertTriangle };

const activityColors = {
  deployment_created: 'bg-blue-100 text-blue-600',
  api_key_generated: 'bg-purple-100 text-purple-600',
  deployment_scaled: 'bg-green-100 text-green-600',
  deployment_stopped: 'bg-gray-100 text-gray-600',
  deployment_failed: 'bg-red-100 text-red-600',
};

export function Dashboard() {
  return (
    <MainLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your ML platform</p>
        </div>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Deployments"
          value="5"
          trend="up"
          trendLabel="+2 this week"
          icon={Server}
          color="blue"
        />
        <MetricCard
          title="API Requests"
          value="1.2M"
          trend="up"
          trendLabel="+15% vs last week"
          icon={Activity}
          color="green"
        />
        <MetricCard
          title="Avg Latency"
          value="2.1s"
          trend="down"
          trendLabel="-0.3s improvement"
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Monthly Cost"
          value="$47.50"
          trendLabel="12% of budget"
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">API Requests Over Time</h3>
          <LineChart
            data={requestsChartData}
            xKey="date"
            lines={[{ key: 'requests', color: '#2563eb', name: 'Requests' }]}
            height={280}
          />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Latency (p50 / p95)</h3>
          <LineChart
            data={latencyChartData}
            xKey="date"
            lines={[
              { key: 'p50', color: '#2563eb', name: 'p50' },
              { key: 'p95', color: '#f59e0b', name: 'p95' },
            ]}
            height={280}
          />
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((event) => {
            const Icon = iconMap[event.icon];
            return (
              <div key={event.id} className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${activityColors[event.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{event.message}</p>
                  <p className="text-sm text-gray-500">{event.detail}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{event.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </MainLayout>
  );
}
