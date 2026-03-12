export const APP_NAME = 'NeuralDeploy';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const STATUS_COLORS = {
  running: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  stopped: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  failed: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/models', label: 'Models', icon: 'Box' },
  { path: '/deployments', label: 'Deployments', icon: 'Server' },
  { path: '/api-keys', label: 'API Keys', icon: 'Key' },
  { path: '/billing', label: 'Billing', icon: 'CreditCard' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For individuals getting started',
    features: ['1 deployment', '2GB RAM limit', '10K API requests/month', 'Community support', 'Basic metrics'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For teams building production apps',
    features: ['20 deployments', '50GB RAM limit', '10M API requests/month', 'Priority support', 'Advanced metrics', 'Auto-scaling', 'Custom domains'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: ['Unlimited deployments', 'Unlimited RAM', 'Unlimited API requests', 'Dedicated support', 'SLA guarantee', 'SSO / SAML', 'On-premise option', 'Custom integrations'],
    cta: 'Contact Sales',
    popular: false,
  },
];
