import { Router } from 'express';

let deployments = [
  { id: 'deploy-abc123', name: 'llama2-prod', model: 'Llama 2', status: 'running', requests: 45200, latency: '2.1s', uptime: '99.8%', cpu: { used: 2.4, total: 4.0, percent: 60 }, ram: { used: 6.0, total: 8.0, percent: 75 }, apiEndpoint: 'https://api.neuraldeploy.com/v1/llama2-prod', costPerHour: 0.09, totalCost: 12.45, createdAt: '2024-01-15T10:30:00Z' },
  { id: 'deploy-def456', name: 'mistral-dev', model: 'Mistral', status: 'pending', requests: 0, latency: '-', uptime: '-', cpu: { used: 0, total: 4.0, percent: 0 }, ram: { used: 0, total: 8.0, percent: 0 }, apiEndpoint: 'https://api.neuraldeploy.com/v1/mistral-dev', costPerHour: 0.08, totalCost: 0, createdAt: '2024-01-20T14:00:00Z' },
  { id: 'deploy-ghi789', name: 'phi-test', model: 'Phi-2', status: 'running', requests: 12800, latency: '0.8s', uptime: '99.9%', cpu: { used: 0.8, total: 2.0, percent: 40 }, ram: { used: 1.5, total: 4.0, percent: 38 }, apiEndpoint: 'https://api.neuraldeploy.com/v1/phi-test', costPerHour: 0.04, totalCost: 3.20, createdAt: '2024-01-18T09:15:00Z' },
];

export const deploymentsRouter = Router();

deploymentsRouter.get('/', (req, res) => {
  res.json({ data: deployments });
});

deploymentsRouter.get('/:id', (req, res) => {
  const dep = deployments.find((d) => d.id === req.params.id);
  if (!dep) return res.status(404).json({ error: 'Deployment not found' });
  res.json({ data: dep });
});

deploymentsRouter.post('/', (req, res) => {
  const { name, modelId, modelName } = req.body;
  const newDep = {
    id: `deploy-${Math.random().toString(36).substring(2, 8)}`,
    name,
    model: modelName || modelId,
    status: 'pending',
    requests: 0,
    latency: '-',
    uptime: '-',
    cpu: { used: 0, total: 4.0, percent: 0 },
    ram: { used: 0, total: 8.0, percent: 0 },
    apiEndpoint: `https://api.neuraldeploy.com/v1/${name}`,
    costPerHour: 0.09,
    totalCost: 0,
    createdAt: new Date().toISOString(),
  };
  deployments.unshift(newDep);
  res.status(201).json({ data: newDep });
});

deploymentsRouter.delete('/:id', (req, res) => {
  deployments = deployments.filter((d) => d.id !== req.params.id);
  res.json({ success: true });
});
