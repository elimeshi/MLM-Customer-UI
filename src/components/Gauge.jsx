import React from 'react';
import { useCommission } from '../context/SpendCapContext';
import { Lock, Unlock, TrendingUp } from 'lucide-react';

const Gauge = () => {
    const {
        personalSpend,
        claimableCommission,
        lockedCommission,
        capUsage
    } = useCommission();

    // Circle properties
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Progress calculation (capped at 100% for the main ring)
    const strokeDashoffset = circumference - (Math.min(capUsage, 100) / 100) * circumference;

    return (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-500 to-purple-500 opacity-50"></div>

            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">קיבולת רווחים</h3>

            <div className="relative flex items-center justify-center">
                {/* SVG Gauge */}
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform rotate-90"
                >
                    {/* Background Ring */}
                    <circle
                        stroke="#374151"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Ring */}
                    <circle
                        stroke="url(#gradient)"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">\${claimableCommission.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 mt-1">ניתן למשיכה</span>
                </div>
            </div>

            <div className="mt-6 w-full space-y-3">
                {/* Cap Info */}
                <div className="flex justify-between items-center text-sm p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-400" />
                        <span className="text-gray-300">תקרת הוצאות</span>
                    </div>
                    <span className="font-semibold text-white">\${personalSpend.toFixed(2)}</span>
                </div>

                {/* Locked Warning */}
                {lockedCommission > 0 ? (
                    <div className="flex justify-between items-center text-sm p-3 bg-red-900/20 border border-red-800/50 rounded-lg animate-pulse">
                        <div className="flex items-center gap-2">
                            <Lock size={16} className="text-red-400" />
                            <span className="text-gray-300">נעול</span>
                        </div>
                        <span className="font-semibold text-red-400">\${lockedCommission.toFixed(2)}</span>
                    </div>
                ) : (
                    <div className="flex justify-between items-center text-sm p-3 bg-green-900/10 border border-green-800/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Unlock size={16} className="text-green-500/70" />
                            <span className="text-gray-400">הרווחים הבאים ישוחררו</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gauge;
