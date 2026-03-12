import { Router } from 'express';

const apiKeys = [
  { id: 'key-1', name: 'Production Key', prefix: 'nd_prod_abc123...', created: '2024-01-10', lastUsed: '2 hours ago', permissions: 'Read + Write', requestCount: 34500 },
  { id: 'key-2', name: 'Development Key', prefix: 'nd_test_xyz789...', created: '2024-01-12', lastUsed: '6 hours ago', permissions: 'Read + Write', requestCount: 8200 },
  { id: 'key-3', name: 'CI/CD Pipeline', prefix: 'nd_prod_mno345...', created: '2024-01-15', lastUsed: '8 hours ago', permissions: 'Read Only', requestCount: 12100 },
];

export const apiKeysRouter = Router();

apiKeysRouter.get('/', (req, res) => {
  res.json({ data: apiKeys });
});
