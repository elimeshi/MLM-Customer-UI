import React from 'react';
import { SpendCapProvider } from './context/SpendCapContext';
import DashboardLayout from './layouts/DashboardLayout';
import Gauge from './components/Gauge';
import TreeVisualization from './components/TreeVisualization';
import StorefrontBridge from './components/StorefrontBridge';

function App() {
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
              <h3 className="text-white font-bold mb-2">Platform Announcements</h3>
              <p className="text-gray-400 text-sm">
                Welcome to the Project Gem Beta! Your spend cap is active.
                Remember that commissions are locked until your personal spend matches them.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Network Tree */}
        <div className="w-full">
          <h3 className="text-xl font-bold text-white mb-4">Network Visualization</h3>
          <TreeVisualization />
        </div>

      </DashboardLayout>
    </SpendCapProvider>
  );
}

export default App;
