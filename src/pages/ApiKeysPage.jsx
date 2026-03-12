import React, { useState, useCallback } from 'react';
import { Key, Plus, Copy, Eye, EyeOff, MoreVertical, Info, RotateCw, Trash2, Edit } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { BarChart } from '@/components/charts/BarChart';
import { apiKeys } from '@/data/deployments';
import { copyToClipboard, formatDate } from '@/utils/formatters';

export function ApiKeysPage() {
  const [keys] = useState(apiKeys);
  const [revealedKey, setRevealedKey] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermission, setNewKeyPermission] = useState('read-write');

  const handleCopy = useCallback(async (text, id) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const usageData = keys.map((k) => ({
    name: k.name.length > 15 ? k.name.substring(0, 15) + '...' : k.name,
    requests: k.requestCount,
  }));

  return (
    <MainLayout breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'API Keys' }]}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage authentication for your deployments</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New API Key
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3 mb-6">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          API keys authenticate requests to your model endpoints. Keep them secure and never expose them in client-side code.
        </p>
      </div>

      {/* Keys table */}
      <Card padding="p-0" className="mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {keys.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Key className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{apiKey.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-600">
                        {revealedKey === apiKey.id ? apiKey.key : apiKey.prefix}
                      </code>
                      <button
                        onClick={() => handleCopy(apiKey.key, apiKey.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label="Copy key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRevealedKey(revealedKey === apiKey.id ? null : apiKey.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label={revealedKey === apiKey.id ? 'Hide key' : 'Reveal key'}
                      >
                        {revealedKey === apiKey.id ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {copiedId === apiKey.id && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(apiKey.created)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{apiKey.lastUsedLabel}</td>
                  <td className="px-6 py-4">
                    <Badge variant={apiKey.permissions === 'Read Only' ? 'neutral' : 'info'}>
                      {apiKey.permissions}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setMenuOpen(menuOpen === apiKey.id ? null : apiKey.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpen === apiKey.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <RotateCw className="w-4 h-4" /> Rotate
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Revoke
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Usage chart */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Requests by API Key</h3>
        <BarChart data={usageData} xKey="name" yKey="requests" color="#7c3aed" height={250} />
      </Card>

      {/* Create modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New API Key">
        <div className="space-y-4">
          <Input
            label="Key Name"
            placeholder="e.g., Production Key"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
            <select
              value={newKeyPermission}
              onChange={(e) => setNewKeyPermission(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="read-write">Read + Write</option>
              <option value="read-only">Read Only</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={() => { setShowCreateModal(false); setNewKeyName(''); }}>Create Key</Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
