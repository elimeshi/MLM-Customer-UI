import React, { createContext, useContext, useState, useEffect } from 'react';

const SpendCapContext = createContext();

export const useCommission = () => {
    const context = useContext(SpendCapContext);
    if (!context) {
        throw new Error('useCommission must be used within a SpendCapProvider');
    }
    return context;
};

export const SpendCapProvider = ({ children }) => {
    const [userId, setUserId] = useState(null); // Will be set by Login
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
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/user/${id}/balance`);
            if (!res.ok) throw new Error('Failed to fetch balance');

            const data = await res.json();

            // Calculate derived stats from backend data
            const personalSpend = data.total_spent;
            const totalEarned = data.total_earned;
            const pendingCommission = data.pending_pool;

            // In this system, "total_earned" is money already successfully paid/credited to the user.
            // So claimable + locked logic works a bit differently than the pure mocks.
            // For the UI Gauge:
            // "Claimable/Cleared" = total_earned (money you successfully got)
            // "Locked" = pending_pool (money waiting for cap space)

            // Re-interpreting backend logic for the UI:
            // Backend: "pending_cap" commissions are commissions that TRIED to pay but couldn't.
            // So `pending_pool` is effectively the "Locked/Missed" amount if we want to show it that way,
            // OR it's money waiting in a holding tank. The backend implementation treats 'pending_cap' as potential.

            const capUsage = personalSpend > 0 ? (totalEarned / personalSpend) * 100 : 0;

            setStats({
                personalSpend,
                totalCleared: totalEarned, // Already paid out
                pendingCommission: 0, // Not explicitly tracked in this backend simplified view other than pending_cap
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
        }
    }, [userId]);

    const login = (id) => {
        setUserId(id);
        setError(null);
    };

    const logout = () => {
        setUserId(null);
        setStats({
            personalSpend: 0,
            totalCleared: 0,
            pendingCommission: 0,
            claimableCommission: 0,
            lockedCommission: 0,
            capUsage: 0
        });
    };

    const addSpend = async (amount) => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            loading,
            error,
            login,
            logout,
            addSpend
        }}>
            {children}
        </SpendCapContext.Provider>
    );
};
