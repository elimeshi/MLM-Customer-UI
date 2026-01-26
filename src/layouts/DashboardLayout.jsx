import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Gem } from 'lucide-react';

const SidebarItem = ({ icon, label, active = false }) => (
    <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Gem size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Project Gem</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active />
                    <SidebarItem icon={<Users size={20} />} label="My Network" />
                    <SidebarItem icon={<ShoppingBag size={20} />} label="Store" />
                    <SidebarItem icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-8">
                    <h2 className="text-gray-200 font-semibold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-white">Eli Meshi</div>
                            <div className="text-xs text-gray-400">Distributor ID: #88219</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600"></div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
