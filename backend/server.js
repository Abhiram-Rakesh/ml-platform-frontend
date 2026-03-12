import express from 'express';
import cors from 'cors';
import { deploymentsRouter } from './routes/deployments.js';
import { modelsRouter } from './routes/models.js';
import { apiKeysRouter } from './routes/apiKeys.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/deployments', deploymentsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/api-keys', apiKeysRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`ML Platform API running on port ${PORT}`);
});
