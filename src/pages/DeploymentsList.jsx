import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server, Search, Plus, Activity, Clock, CheckCircle,
  Copy, ExternalLink, DollarSign, Pause, Play, Maximize2,
  FileText, Settings, Trash2, LayoutGrid, List,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { deployments as initialDeployments } from '@/data/deployments';
import { copyToClipboard } from '@/utils/formatters';

export function DeploymentsList() {
  const navigate = useNavigate();
  const [deployments] = useState(initialDeployments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = useCallback(async (text, id) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const filtered = deployments.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    all: deployments.length,
    running: deployments.filter((d) => d.status === 'running').length,
    pending: deployments.filter((d) => d.status === 'pending').length,
    stopped: deployments.filter((d) => d.status === 'stopped').length,
    failed: deployments.filter((d) => d.status === 'failed').length,
  };

  return (
    <MainLayout breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Deployments' }]}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Deployments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your model deployments</p>
        </div>
        <Button onClick={() => navigate('/deployments/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Deployment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search deployments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status chips */}
      <div className="flex gap-2 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dep) => (
          <Card key={dep.id} hover className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{dep.name}</h3>
                  <p className="text-xs text-gray-500">{dep.model}</p>
                </div>
              </div>
              <StatusBadge status={dep.status} />
            </div>

            {/* ID */}
            <div className="flex items-center gap-2 mb-3">
              <code className="text-xs text-gray-500 font-mono">{dep.id}</code>
              <button
                onClick={() => handleCopy(dep.id, dep.id)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                aria-label="Copy deployment ID"
              >
                <Copy className="w-3 h-3" />
              </button>
              {copiedId === dep.id && (
                <span className="text-xs text-green-600">Copied!</span>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-3">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <Activity className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{dep.requestsFormatted}</p>
                  <p className="text-xs text-gray-500">requests</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <Clock className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{dep.latency}</p>
                  <p className="text-xs text-gray-500">latency</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{dep.uptime}</p>
                  <p className="text-xs text-gray-500">uptime</p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="border-t border-gray-100 pt-3 mb-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">CPU</span>
                  <span className="text-gray-700">{dep.cpu.used} / {dep.cpu.total} cores</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dep.cpu.percent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">RAM</span>
                  <span className="text-gray-700">{dep.ram.used} / {dep.ram.total} GB</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${dep.ram.percent}%` }} />
                </div>
              </div>
            </div>

            {/* Endpoint */}
            <div className="border-t border-gray-100 pt-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">API Endpoint</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-50 px-2 py-1.5 rounded font-mono text-gray-700 truncate">
                  {dep.apiEndpoint}
                </code>
                <button
                  onClick={() => handleCopy(dep.apiEndpoint, `ep-${dep.id}`)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Copy endpoint"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              {copiedId === `ep-${dep.id}` && (
                <span className="text-xs text-green-600">Copied!</span>
              )}
            </div>

            {/* Cost */}
            <div className="border-t border-gray-100 pt-3 mb-3 flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">${dep.costPerHour.toFixed(2)}/hour</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Total: ${dep.totalCost.toFixed(2)}</span>
            </div>

            {dep.errorMessage && (
              <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-md mb-3">
                {dep.errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between">
              <div className="flex gap-1">
                {dep.status === 'running' ? (
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Stop">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : dep.status === 'stopped' ? (
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md" title="Start">
                    <Play className="w-4 h-4" />
                  </button>
                ) : null}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Scale">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Logs">
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  title="Settings"
                  onClick={() => navigate(`/deployments/${dep.id}`)}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}

        {/* Create New placeholder */}
        <div
          onClick={() => navigate('/deployments/create')}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors min-h-[300px]"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">Create new deployment</p>
        </div>
      </div>
    </MainLayout>
  );
}
