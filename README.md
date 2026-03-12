# NeuralDeploy - Enterprise ML Model Hosting Platform

Professional B2B SaaS platform for deploying and managing AI models on Kubernetes infrastructure.

## Features

- **One-Click Deployment** - Deploy Llama 2, Mistral, Phi-2, and more in seconds
- **Real-Time Metrics** - Monitor requests, latency, uptime, and resource usage
- **API Key Management** - Create, rotate, and revoke API keys with granular permissions
- **Cost Tracking** - Usage-based billing with detailed breakdowns and invoicing
- **Auto-Scaling** - Automatically scale deployments based on traffic
- **Team Collaboration** - Role-based access control for teams

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Backend:** Node.js + Express (mock API)
- **Deployment:** AWS EC2 + Nginx + PM2

## Quick Start

```bash
# Install frontend dependencies
npm install

# Start frontend dev server
npm run dev

# In another terminal - start backend
cd backend
npm install
npm start
```

Open http://localhost:5173 in your browser.

## Project Structure

```
ml-platform-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route page components
│   ├── data/           # Mock data and API
│   └── utils/          # Helpers and constants
├── backend/            # Express mock API
├── deploy/             # EC2 deployment scripts
└── INSTALL.md          # Full deployment guide
```

## Development

```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Deployment

See [INSTALL.md](./INSTALL.md) for complete AWS EC2 deployment instructions.

## License

MIT
