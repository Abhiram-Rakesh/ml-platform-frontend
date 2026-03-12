import React from 'react';
import { CreditCard, Download, FileText, ArrowUpRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { LineChart } from '@/components/charts/LineChart';
import { costChartData, invoices } from '@/data/deployments';
import { formatCurrency } from '@/utils/formatters';

export function BillingPage() {
  return (
    <MainLayout breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Billing & Usage' }]}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Billing & Usage</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan and track spending</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">Pro Plan</h2>
              <span className="bg-blue-500/30 text-blue-100 text-xs px-2.5 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <p className="text-blue-100 mb-1">
              <span className="text-3xl font-bold text-white">$99</span> /month
            </p>
            <p className="text-sm text-blue-200">Renews Feb 15, 2024</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Upgrade Plan
            </Button>
          </div>
          <div className="flex-1 max-w-md space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-100">Deployments</span>
                <span className="text-white font-medium">5 / 20</span>
              </div>
              <div className="w-full h-2 bg-blue-500/30 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-100">API Requests</span>
                <span className="text-white font-medium">1.2M / 10M</span>
              </div>
              <div className="w-full h-2 bg-blue-500/30 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-100">Storage</span>
                <span className="text-white font-medium">125GB / 500GB</span>
              </div>
              <div className="w-full h-2 bg-blue-500/30 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Period */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-500 mb-1">Current Period</p>
          <p className="text-sm font-medium text-gray-700 mb-3">January 1 - 31, 2024</p>
          <p className="text-4xl font-bold text-gray-900">$47.50</p>
          <p className="text-sm text-gray-500 mt-1">Current charges</p>
          <Button variant="secondary" size="sm" className="mt-4">
            View Breakdown
          </Button>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Previous Period</p>
          <p className="text-sm font-medium text-gray-700 mb-3">December 2023</p>
          <p className="text-4xl font-bold text-gray-900">$52.30</p>
          <p className="text-sm text-green-600 mt-1">-9.2% from last month</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Payment Method</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2025</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-4">
            Update
          </Button>
        </Card>
      </div>

      {/* Cost Trends */}
      <Card className="mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Cost Trends</h3>
        <LineChart
          data={costChartData}
          xKey="month"
          lines={[{ key: 'cost', color: '#2563eb', name: 'Monthly Cost ($)' }]}
          height={300}
        />
      </Card>

      {/* Invoice History */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{inv.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inv.period}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" title="View">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </MainLayout>
  );
}
