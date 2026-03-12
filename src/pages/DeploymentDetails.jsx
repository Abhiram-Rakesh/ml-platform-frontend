import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Server, Copy, ExternalLink, Activity, Clock,
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { MetricCard } from '@/components/common/MetricCard';
import { LineChart } from '@/components/charts/LineChart';
import { deployments } from '@/data/deployments';
import { requestsChartData, recentActivity } from '@/data/deployments';
import { copyToClipboard, formatDate } from '@/utils/formatters';

export function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCurl, setShowCurl] = useState(false);
  const [copied, setCopied] = useState(false);

  const deployment = deployments.find((d) => d.id === id);

  const handleCopy = useCallback(async (text) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!deployment) {
    return (
      <MainLayout breadcrumbs={[{ label: 'Deployments', path: '/deployments' }, { label: 'Not Found' }]}>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900">Deployment not found</h2>
          <Button className="mt-4" onClick={() => navigate('/deployments')}>Back to Deployments</Button>
        </div>
      </MainLayout>
    );
  }

  const tabs = ['Overview', 'Metrics', 'Logs', 'Settings'];

  const curlExample = `curl -X POST ${deployment.apiEndpoint}/completions \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello, world!", "max_tokens": 100}'`;

  return (
    <MainLayout breadcrumbs={[
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Deployments', path: '/deployments' },
      { label: deployment.name },
    ]}>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/deployments')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Deployments
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{deployment.name}</h1>
                <StatusBadge status={deployment.status} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm text-gray-500 font-mono">{deployment.id}</code>
                <button
                  onClick={() => handleCopy(deployment.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Copy ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied && <span className="text-xs text-green-600">Copied!</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Scale</Button>
            <Button variant={deployment.status === 'running' ? 'danger' : 'primary'}>
              {deployment.status === 'running' ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Requests"
              value={deployment.requestsFormatted}
              trend="up"
              trendLabel="+15%"
              icon={Activity}
              color="blue"
            />
            <MetricCard
              title="Avg Latency"
              value={deployment.latency}
              trend="down"
              trendLabel="-0.3s"
              icon={Clock}
              color="purple"
            />
            <MetricCard
              title="Error Rate"
              value={deployment.errorRate}
              trend="down"
              trendLabel="-0.01%"
              icon={AlertTriangle}
              color="orange"
            />
            <MetricCard
              title="Uptime"
              value={deployment.uptime}
              trendLabel="Stable"
              icon={CheckCircle}
              color="green"
            />
          </div>

          {/* API Endpoint */}
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">API Endpoint</h3>
            <div className="flex items-center gap-3 mb-3">
              <code className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-md text-sm font-mono text-gray-800">
                {deployment.apiEndpoint}
              </code>
              <Button variant="secondary" size="sm" onClick={() => handleCopy(deployment.apiEndpoint)}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button variant="secondary" size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
            <button
              onClick={() => setShowCurl(!showCurl)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showCurl ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showCurl ? 'Hide' : 'Show'} curl example
            </button>
            {showCurl && (
              <pre className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{curlExample}</code>
              </pre>
            )}
          </Card>

          {/* Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Model</span>
                  <span className="text-gray-900 font-medium">{deployment.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CPU</span>
                  <span className="text-gray-900">{deployment.cpu.total} cores</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Memory</span>
                  <span className="text-gray-900">{deployment.ram.total} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Replicas</span>
                  <span className="text-gray-900">{deployment.replicas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Region</span>
                  <span className="text-gray-900">{deployment.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{formatDate(deployment.createdAt)}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Resource Usage</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">CPU</span>
                    <span className="text-gray-900 font-medium">{deployment.cpu.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${deployment.cpu.percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{deployment.cpu.used} / {deployment.cpu.total} cores</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Memory</span>
                    <span className="text-gray-900 font-medium">{deployment.ram.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${deployment.ram.percent}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{deployment.ram.used} / {deployment.ram.total} GB</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cost */}
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Cost Tracking</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Hour</p>
                <p className="text-lg font-semibold text-gray-900">${deployment.costPerHour.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last 24h</p>
                <p className="text-lg font-semibold text-gray-900">${(deployment.costPerHour * 24).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last 7 Days</p>
                <p className="text-lg font-semibold text-gray-900">${(deployment.costPerHour * 24 * 7).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Month to Date</p>
                <p className="text-lg font-semibold text-gray-900">${deployment.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Events */}
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Events</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400 w-24 flex-shrink-0">{event.time}</span>
                  <span className="text-gray-900 font-medium">{event.message}</span>
                  <span className="text-gray-500">{event.detail}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Metrics tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Requests Over Time</h3>
            <LineChart
              data={requestsChartData}
              xKey="date"
              lines={[{ key: 'requests', color: '#2563eb', name: 'Requests' }]}
              height={350}
            />
          </Card>
        </div>
      )}

      {/* Logs tab */}
      {activeTab === 'logs' && (
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Container Logs</h3>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
            <p className="text-green-400">[2024-01-20T14:30:00Z] INFO: Server started on port 8080</p>
            <p className="text-green-400">[2024-01-20T14:30:01Z] INFO: Model loaded successfully (2.1s)</p>
            <p className="text-green-400">[2024-01-20T14:30:05Z] INFO: Health check passed</p>
            <p>[2024-01-20T14:31:00Z] INFO: Request received - POST /v1/completions</p>
            <p>[2024-01-20T14:31:02Z] INFO: Response sent - 200 OK (2134ms)</p>
            <p>[2024-01-20T14:32:00Z] INFO: Request received - POST /v1/completions</p>
            <p>[2024-01-20T14:32:01Z] INFO: Response sent - 200 OK (1854ms)</p>
            <p className="text-yellow-400">[2024-01-20T14:35:00Z] WARN: High memory usage (85%)</p>
            <p>[2024-01-20T14:36:00Z] INFO: Request received - POST /v1/completions</p>
            <p>[2024-01-20T14:36:02Z] INFO: Response sent - 200 OK (2012ms)</p>
          </div>
        </Card>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Deployment Settings</h3>
            <p className="text-sm text-gray-500">Settings management coming soon.</p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">Once you delete a deployment, there is no going back.</p>
            <Button variant="danger">Delete Deployment</Button>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
