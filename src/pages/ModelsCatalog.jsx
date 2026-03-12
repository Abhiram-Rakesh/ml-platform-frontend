import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Cpu, Sparkles, Brain, Code, Mic, Search, HardDrive, CircuitBoard } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { models } from '@/data/models';

const iconMap = { Server, Cpu, Sparkles, Brain, Code, Mic };

const categoryColors = {
  'Text Generation': 'info',
  'Code Generation': 'success',
  'Speech Recognition': 'warning',
};

export function ModelsCatalog() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [taskFilter, setTaskFilter] = useState('all');

  const filtered = models.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchSize = sizeFilter === 'all' ||
      (sizeFilter === 'small' && parseFloat(m.parameters) < 3) ||
      (sizeFilter === 'medium' && parseFloat(m.parameters) >= 3 && parseFloat(m.parameters) <= 7) ||
      (sizeFilter === 'large' && parseFloat(m.parameters) > 7);
    const matchTask = taskFilter === 'all' || m.category === taskFilter;
    return matchSearch && matchSize && matchTask;
  });

  return (
    <MainLayout breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Model Catalog' }]}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Model Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and deploy foundation models</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Sizes</option>
          <option value="small">Small (&lt;3B)</option>
          <option value="medium">Medium (3-7B)</option>
          <option value="large">Large (&gt;7B)</option>
        </select>
        <select
          value={taskFilter}
          onChange={(e) => setTaskFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tasks</option>
          <option value="Text Generation">Text Generation</option>
          <option value="Code Generation">Code Generation</option>
          <option value="Speech Recognition">Speech Recognition</option>
        </select>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((model) => {
          const Icon = iconMap[model.icon] || Server;
          return (
            <Card key={model.id} hover>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="neutral">{model.parameters} params</Badge>
                    <Badge variant={categoryColors[model.category] || 'neutral'}>
                      {model.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{model.description}</p>

              <div className="space-y-2 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CircuitBoard className="w-4 h-4" />
                  <span>Min CPU: {model.minCpu}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <span>Min RAM: {model.minRam}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">{model.priceLabel}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Details</Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/deployments/create?model=${model.id}`)}
                  >
                    Deploy
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
