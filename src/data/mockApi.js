import { models } from './models';
import { deployments as initialDeployments, apiKeys, invoices } from './deployments';

let deployments = [...initialDeployments];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  async getModels() {
    await delay(300);
    return { data: models };
  },

  async getModel(id) {
    await delay(200);
    const model = models.find((m) => m.id === id);
    if (!model) throw new Error('Model not found');
    return { data: model };
  },

  async getDeployments() {
    await delay(300);
    return { data: deployments };
  },

  async getDeployment(id) {
    await delay(200);
    const deployment = deployments.find((d) => d.id === id);
    if (!deployment) throw new Error('Deployment not found');
    return { data: deployment };
  },

  async createDeployment(config) {
    await delay(800);
    const newDeployment = {
      id: `deploy-${Math.random().toString(36).substring(2, 8)}`,
      name: config.name,
      model: config.modelName,
      modelId: config.modelId,
      status: 'pending',
      requests: 0,
      requestsFormatted: '0',
      latency: '-',
      latencyMs: 0,
      uptime: '-',
      errorRate: '-',
      cpu: { used: 0, total: config.cpuLimit || 4, percent: 0 },
      ram: { used: 0, total: config.memoryLimit || 8, percent: 0 },
      replicas: config.replicas || 1,
      apiEndpoint: `https://api.neuraldeploy.com/v1/${config.name}`,
      costPerHour: config.estimatedCost || 0.09,
      totalCost: 0,
      createdAt: new Date().toISOString(),
      region: config.region || 'us-east-1',
    };
    deployments = [newDeployment, ...deployments];
    return { data: newDeployment };
  },

  async deleteDeployment(id) {
    await delay(500);
    deployments = deployments.filter((d) => d.id !== id);
    return { success: true };
  },

  async updateDeploymentStatus(id, status) {
    await delay(400);
    deployments = deployments.map((d) => (d.id === id ? { ...d, status } : d));
    return { success: true };
  },

  async getApiKeys() {
    await delay(300);
    return { data: apiKeys };
  },

  async getInvoices() {
    await delay(300);
    return { data: invoices };
  },
};
