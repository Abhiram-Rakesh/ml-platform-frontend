import { Router } from 'express';

const models = [
  { id: 'llama2', name: 'Llama 2', displayName: 'Llama 2 (7B)', parameters: '7B', category: 'Text Generation', description: "Meta's open-source LLM optimized for dialogue", minRam: '4GB', minCpu: '2 cores', pricing: 0.08 },
  { id: 'mistral', name: 'Mistral', displayName: 'Mistral (7B)', parameters: '7B', category: 'Text Generation', description: 'High-performance model with sliding window attention', minRam: '4GB', minCpu: '2 cores', pricing: 0.08 },
  { id: 'phi', name: 'Phi-2', displayName: 'Phi-2 (2.7B)', parameters: '2.7B', category: 'Text Generation', description: "Microsoft's compact language model", minRam: '2GB', minCpu: '1 core', pricing: 0.04 },
  { id: 'gpt2', name: 'GPT-2', displayName: 'GPT-2 (1.5B)', parameters: '1.5B', category: 'Text Generation', description: "OpenAI's general-purpose language model", minRam: '2GB', minCpu: '1 core', pricing: 0.03 },
  { id: 'codellama', name: 'CodeLlama', displayName: 'CodeLlama (7B)', parameters: '7B', category: 'Code Generation', description: "Meta's code-specialized model", minRam: '4GB', minCpu: '2 cores', pricing: 0.08 },
  { id: 'whisper', name: 'Whisper', displayName: 'Whisper (Large)', parameters: '1.5B', category: 'Speech Recognition', description: "OpenAI's speech recognition model", minRam: '4GB', minCpu: '2 cores', pricing: 0.06 },
];

export const modelsRouter = Router();

modelsRouter.get('/', (req, res) => {
  res.json({ data: models });
});

modelsRouter.get('/:id', (req, res) => {
  const model = models.find((m) => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: 'Model not found' });
  res.json({ data: model });
});
