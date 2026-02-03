import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Gem, User, X, Mail, Shield, Hash } from 'lucide-react';
import { useCommission } from '../context/SpendCapContext';

import { useAuth } from '../context/AuthContext';

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
    const { userId, loading, error } = useCommission();
    const { signOut, dbUser } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-l border-gray-800 flex flex-col p-4 flex-shrink-0">
                <div className="flex items-center gap-2 px-2 mb-8 mt-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Gem size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">פרויקט יהלום</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="מבט על" active />
                    <SidebarItem icon={<Users size={20} />} label="הרשת שלי" />
                    <SidebarItem icon={<ShoppingBag size={20} />} label="חנות" />
                    <SidebarItem icon={<Settings size={20} />} label="הגדרות" />
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">יציאה</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {loading && (
                    <div className="absolute top-0 left-0 w-full h-1 z-50">
                        <div className="h-full bg-indigo-500 animate-progress"></div>
                    </div>
                )}
                <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-8">
                    <h2 className="text-gray-200 font-semibold">לוח בקרה</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="w-10 h-10 p-2 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-all overflow-hidden group"
                        >
                            <User size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Profile Modal */}
                {isProfileOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsProfileOpen(false)}
                        ></div>
                        <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-800/30">
                                <h3 className="text-lg font-bold">פרופיל משתמש</h3>
                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="group p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X size={20} className='text-gray-900 group-hover:text-gray-50' />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xl">
                                        <User size={48} />
                                    </div>
                                </div>
                                <div className="text-center mb-8">
                                    <h4 className="text-xl font-bold">{dbUser?.username || 'טוען...'}</h4>
                                    <p className="text-gray-400 text-sm">{dbUser?.role === 'admin' ? 'מנהל מערכת' : 'מפיץ מורשה'}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <div className="text-indigo-400">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">כתובת אימייל</div>
                                            <div className="text-sm font-medium">{dbUser?.email || '...'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <div className="text-purple-400">
                                            <Hash size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">מזהה משתמש</div>
                                            <div className="text-sm font-medium">{dbUser?.id || '...'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <div className="text-emerald-400">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">תפקיד</div>
                                            <div className="text-sm font-medium">{dbUser?.role || '...'}</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => signOut()}
                                    className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold"
                                >
                                    <LogOut size={20} />
                                    <span>יציאה מהמערכת</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
                            <Settings size={20} />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {children}
                </div>
            </main>

            <style>{`
        @keyframes progress {
            0% { width: 0%;   margin-right: 0; }
            50% { width: 50%; }
            100% { width: 100%; margin-right: 100%; } 
        }
        .animate-progress {
            animation: progress 1.5s infinite linear;
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
