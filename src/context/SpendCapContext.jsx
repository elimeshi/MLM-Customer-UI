import React, { createContext, useContext, useState, useEffect } from 'react';

import { useAuth } from './AuthContext';

const SpendCapContext = createContext();

export const useCommission = () => {
    const context = useContext(SpendCapContext);
    if (!context) {
        throw new Error('useCommission must be used within a SpendCapProvider');
    }
    return context;
};

export const SpendCapProvider = ({ children }) => {
    const { dbUser, session, loading: authLoading } = useAuth();
    const userId = dbUser?.id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [stats, setStats] = useState({
        personalSpend: 0,
        totalCleared: 0,
        pendingCommission: 0,
        claimableCommission: 0,
        lockedCommission: 0,
        capUsage: 0
    });

    const fetchBalance = async (id) => {
        if (!id || !session?.access_token) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/user/${id}/balance`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch balance');

            const data = await res.json();

            // Calculate derived stats from backend data
            const personalSpend = data.total_spent;
            const totalEarned = data.total_earned;
            const pendingCommission = data.pending_pool;

            const capUsage = personalSpend > 0 ? (totalEarned / personalSpend) * 100 : 0;

            setStats({
                personalSpend,
                totalCleared: totalEarned, // Already paid out
                pendingCommission: 0,
                claimableCommission: totalEarned, // For gauge
                lockedCommission: pendingCommission, // Waiting for cap
                capUsage
            });

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchBalance(userId);
        } else if (!authLoading) {
            setStats({
                personalSpend: 0,
                totalCleared: 0,
                pendingCommission: 0,
                claimableCommission: 0,
                lockedCommission: 0,
                capUsage: 0
            });
        }
    }, [userId, authLoading]);

    const addSpend = async (amount) => {
        if (!userId || !session?.access_token) return;
        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ user_id: userId, amount })
            });
            if (!res.ok) throw new Error('Purchase failed');

            // Refresh stats
            await fetchBalance(userId);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SpendCapContext.Provider value={{
            ...stats,
            userId,
            loading: loading || authLoading,
            error,
            addSpend
        }}>
            {children}
        </SpendCapContext.Provider>
    );
};
