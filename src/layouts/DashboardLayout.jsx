import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Gem } from 'lucide-react';
import { useCommission } from '../context/SpendCapContext';

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
    const { userId, login, logout, personalSpend, loading, error } = useCommission();
    const [inputUserId, setInputUserId] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (inputUserId) login(inputUserId);
    };

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Gem size={28} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">ברוך הבא</h2>
                    <p className="text-gray-400 text-center mb-8">הכנס את המזהה מפיץ שלך כדי להיכנס.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">מזהה משתמש</label>
                            <input
                                type="text"
                                value={inputUserId}
                                onChange={(e) => setInputUserId(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-right"
                                placeholder="לדוגמה: 1"
                                dir="ltr"
                            />
                        </div>
                        {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-600/20"
                        >
                            כנס ללוח הבקרה
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        פרויקט יהלום - פלטפורמת דמו MLM
                    </div>
                </div>
            </div>
        );
    }

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
                        onClick={logout}
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
                        <div className="text-left hidden sm:block">
                            <div className="text-sm font-medium text-white">משתמש #{userId}</div>
                            <div className="text-xs text-gray-400">מפיץ</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400">
                            <Users size={20} />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
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
