import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ModelsCatalog } from './pages/ModelsCatalog';
import { DeploymentsList } from './pages/DeploymentsList';
import { DeploymentDetails } from './pages/DeploymentDetails';
import { CreateDeployment } from './pages/CreateDeployment';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { BillingPage } from './pages/BillingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/models" element={<ModelsCatalog />} />
      <Route path="/deployments" element={<DeploymentsList />} />
      <Route path="/deployments/create" element={<CreateDeployment />} />
      <Route path="/deployments/:id" element={<DeploymentDetails />} />
      <Route path="/api-keys" element={<ApiKeysPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/settings" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
