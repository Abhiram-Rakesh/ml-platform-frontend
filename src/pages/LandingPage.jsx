import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Rocket,
  Shield,
  BarChart3,
  Zap,
  Code,
  Users,
  Check,
  ArrowRight,
  Github,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { APP_NAME, PRICING_PLANS } from '@/utils/constants';

const features = [
  { icon: Rocket, title: 'One-Click Deployment', description: 'Deploy foundation models in seconds with pre-configured templates and optimized infrastructure.' },
  { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption, RBAC, and audit logging for every API call.' },
  { icon: BarChart3, title: 'Cost Optimization', description: 'Smart scaling and resource management to keep your inference costs predictable and low.' },
  { icon: Zap, title: 'Auto-Scaling', description: 'Automatically scale from zero to thousands of requests per second based on demand.' },
  { icon: Code, title: 'Developer API', description: 'RESTful API with SDKs for Python, Node.js, and Go. OpenAI-compatible endpoints.' },
  { icon: Users, title: 'Team Collaboration', description: 'Invite team members, manage roles, and share deployments across your organization.' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-7 h-7 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">{APP_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Docs</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/login')}>Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Now supporting Llama 3 and Mistral 7B
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Deploy AI Models at{' '}
            <span className="text-blue-600">Enterprise Scale</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Self-service ML model hosting platform. Deploy Llama 2, Mistral, and more
            in seconds with production-grade infrastructure.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button size="lg" onClick={() => navigate('/login')}>
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required. Free tier includes 1 deployment.</p>
        </div>
      </section>

      {/* Metrics bar */}
      <section className="bg-gray-900 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10K+', label: 'Active Deployments' },
            { value: '50M+', label: 'API Requests / Day' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<100ms', label: 'p50 Latency' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to deploy AI</h2>
            <p className="mt-4 text-lg text-gray-600">Built for teams that need reliability, performance, and control.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Start free, scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
                  plan.popular
                    ? 'border-blue-600 ring-2 ring-blue-600 relative'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full mt-6"
                  onClick={() => navigate('/login')}
                >
                  {plan.cta}
                </Button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Ready to deploy your first model?</h2>
          <p className="mt-4 text-lg text-blue-100">Get started in under 5 minutes. No credit card required.</p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-8 bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/login')}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-blue-400" />
              <span className="text-base font-semibold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed">Enterprise ML model hosting platform for modern AI teams.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
              <li className="hover:text-white cursor-pointer transition-colors">Roadmap</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tutorials</li>
              <li className="hover:text-white cursor-pointer transition-colors">Status Page</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">About</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; 2024 {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
