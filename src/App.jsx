import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpendCapProvider } from './context/SpendCapContext';
import DashboardLayout from './layouts/DashboardLayout';
import Gauge from './components/Gauge';
import TreeVisualization from './components/TreeVisualization';
import StorefrontBridge from './components/StorefrontBridge';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

function Dashboard() {
  return (
    <SpendCapProvider>
      <DashboardLayout>
        {/* Top Row: Gauge & Storefront */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gauge - Takes 1 column */}
          <div className="lg:col-span-1">
            <Gauge />
          </div>

          {/* Storefront - Takes 2 columns */}
          <div className="lg:col-span-2">
            <StorefrontBridge />
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">הודעות פלטפורמה</h3>
              <p className="text-gray-400 text-sm">
                ברוכים הבאים לגרסת הבטא של פרויקט יהלום! תקרת ההוצאות שלך פעילה.
                זכור שהעמלות נעולות עד שההוצאה האישית שלך תהיה שווה להן.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Network Tree */}
        <div className="w-full">
          <h3 className="text-xl font-bold text-white mb-4">ויזואליזציה של הרשת</h3>
          <TreeVisualization />
        </div>
      </DashboardLayout>
    </SpendCapProvider>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
