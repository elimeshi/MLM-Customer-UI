import React, { createContext, useContext, useState, useMemo } from 'react';

const SpendCapContext = createContext();

export const useCommission = () => {
    const context = useContext(SpendCapContext);
    if (!context) {
        throw new Error('useCommission must be used within a SpendCapProvider');
    }
    return context;
};

export const SpendCapProvider = ({ children }) => {
    // Mock Data State
    const [personalSpend, setPersonalSpend] = useState(150.00); // User bought $150 worth of items
    const [commissions, setCommissions] = useState([
        { id: 1, amount: 50.00, status: 'cleared', source: 'User A' },
        { id: 2, amount: 120.00, status: 'cleared', source: 'User B' },
        { id: 3, amount: 300.00, status: 'pending', source: 'User C' }, // In holding period
        { id: 4, amount: 80.00, status: 'cleared', source: 'User D' },
    ]);

    const stats = useMemo(() => {
        // 1. Calculate Total Cleared Earnings (Potential)
        const totalCleared = commissions
            .filter(c => c.status === 'cleared')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // 2. Calculate Pending Commission
        const pendingCommission = commissions
            .filter(c => c.status === 'pending')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // 3. The Spend-Cap Logic
        // Earnable is capped by PersonalSpend
        const claimableCommission = Math.min(totalCleared, personalSpend);

        // 4. Locked Commission (Excess earnings over the cap)
        const lockedCommission = Math.max(0, totalCleared - personalSpend);

        return {
            personalSpend,
            totalCleared,
            pendingCommission,
            claimableCommission,
            lockedCommission,
            capUsage: personalSpend > 0 ? (claimableCommission / personalSpend) * 100 : 0
        };
    }, [personalSpend, commissions]);

    const addSpend = (amount) => {
        setPersonalSpend(prev => prev + amount);
    };

    const addCommission = (amount, status = 'pending') => {
        setCommissions(prev => [
            ...prev,
            { id: Date.now(), amount, status, source: 'New Sale' }
        ]);
    };

    return (
        <SpendCapContext.Provider value={{ ...stats, addSpend, addCommission }}>
            {children}
        </SpendCapContext.Provider>
    );
};
