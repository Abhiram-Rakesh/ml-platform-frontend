import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Server, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { models } from '@/data/models';
import { api } from '@/data/mockApi';

const steps = ['Select Model', 'Configure Resources', 'Advanced', 'Review'];

export function CreateDeployment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedModel = searchParams.get('model');

  const [currentStep, setCurrentStep] = useState(preselectedModel ? 1 : 0);
  const [selectedModelId, setSelectedModelId] = useState(preselectedModel || '');
  const [name, setName] = useState('');
  const [cpuRequest, setCpuRequest] = useState(2);
  const [cpuLimit, setCpuLimit] = useState(4);
  const [memRequest, setMemRequest] = useState(4);
  const [memLimit, setMemLimit] = useState(8);
  const [replicas, setReplicas] = useState(1);
  const [autoScale, setAutoScale] = useState(false);
  const [region, setRegion] = useState('us-east-1');
  const [envVars, setEnvVars] = useState('');
  const [creating, setCreating] = useState(false);
  const [nameError, setNameError] = useState('');

  const selectedModel = models.find((m) => m.id === selectedModelId);

  const estimatedCost = useMemo(() => {
    if (!selectedModel) return { compute: 0, storage: 0.01, total: 0 };
    const compute = selectedModel.pricing;
    const storage = 0.01;
    const total = (compute + storage) * replicas;
    return { compute, storage, total };
  }, [selectedModel, replicas]);

  const validateName = (v) => {
    if (!v) return 'Deployment name is required';
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(v) && v.length > 1)
      return 'Use lowercase letters, numbers, and hyphens only';
    if (v.length < 3) return 'Must be at least 3 characters';
    return '';
  };

  const handleNext = () => {
    if (currentStep === 0 && !selectedModelId) return;
    if (currentStep === 1) {
      const err = validateName(name);
      if (err) { setNameError(err); return; }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.createDeployment({
        name,
        modelId: selectedModelId,
        modelName: selectedModel?.name,
        cpuRequest,
        cpuLimit,
        memoryRequest: memRequest,
        memoryLimit: memLimit,
        replicas,
        autoScale,
        region,
        estimatedCost: estimatedCost.total,
      });
      navigate('/deployments');
    } catch {
      setCreating(false);
    }
  };

  return (
    <MainLayout breadcrumbs={[
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Deployments', path: '/deployments' },
      { label: 'Create Deployment' },
    ]}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Create New Deployment</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i < currentStep
                    ? 'bg-blue-600 text-white'
                    : i === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${
                  i <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  i < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="col-span-2">
            {/* Step 0: Select Model */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Select a Model</h2>
                <div className="grid grid-cols-2 gap-4">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedModelId === model.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{model.displayName}</span>
                      </div>
                      <Badge variant="neutral">{model.category}</Badge>
                      <p className="text-xs text-gray-500 mt-2">{model.priceLabel}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Configure Resources */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {selectedModel && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Server className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{selectedModel.displayName}</span>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  </div>
                )}

                <Input
                  label="Deployment Name"
                  placeholder="e.g., llama2-production"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  error={nameError}
                  helperText="Use lowercase letters, numbers, and hyphens"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPU Allocation: {cpuRequest} cores (limit: {cpuLimit} cores)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={cpuRequest}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCpuRequest(v);
                      setCpuLimit(Math.max(v * 2, cpuLimit));
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 core</span><span>8 cores</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Allocation: {memRequest}GB (limit: {memLimit}GB)
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={32}
                    step={2}
                    value={memRequest}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMemRequest(v);
                      setMemLimit(Math.max(v * 2, memLimit));
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2GB</span><span>32GB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Replicas</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={replicas}
                    onChange={(e) => setReplicas(Math.max(1, Math.min(10, Number(e.target.value))))}
                    className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enable Auto-Scaling</label>
                    <p className="text-xs text-gray-500">Automatically adjust replicas based on traffic</p>
                  </div>
                  <button
                    onClick={() => setAutoScale(!autoScale)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoScale ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={autoScale}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      autoScale ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Advanced */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Advanced Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">EU (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment Variables
                  </label>
                  <textarea
                    value={envVars}
                    onChange={(e) => setEnvVars(e.target.value)}
                    placeholder="KEY=value (one per line)"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Review Deployment</h2>
                <Card>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Model</span>
                      <span className="text-gray-900 font-medium">{selectedModel?.displayName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Deployment Name</span>
                      <span className="text-gray-900 font-mono">{name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">CPU</span>
                      <span className="text-gray-900">{cpuRequest} cores (limit: {cpuLimit})</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Memory</span>
                      <span className="text-gray-900">{memRequest}GB (limit: {memLimit}GB)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Replicas</span>
                      <span className="text-gray-900">{replicas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Auto-Scaling</span>
                      <span className="text-gray-900">{autoScale ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Region</span>
                      <span className="text-gray-900">{region}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={currentStep === 0 ? () => navigate('/deployments') : handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext} disabled={currentStep === 0 && !selectedModelId}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleCreate} loading={creating}>
                  Create Deployment
                </Button>
              )}
            </div>
          </div>

          {/* Cost sidebar */}
          <div>
            <div className="sticky top-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
              <h4 className="text-sm font-semibold text-blue-100 mb-4">Estimated Cost</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Compute</span>
                  <span>${estimatedCost.compute.toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Storage</span>
                  <span>${estimatedCost.storage.toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Replicas</span>
                  <span>&times;{replicas}</span>
                </div>
                <div className="border-t border-blue-500 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${estimatedCost.total.toFixed(2)}/hr</span>
                  </div>
                  <p className="text-blue-200 text-xs mt-1">
                    ~${(estimatedCost.total * 24 * 30).toFixed(2)}/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
