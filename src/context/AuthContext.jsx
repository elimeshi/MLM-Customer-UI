import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDbUser = async (jwt) => {
        if (!jwt) return;
        try {
            const res = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setDbUser(data);
            } else if (res.status === 401) {
                console.warn('Unauthorized access to /api/me. Session might be invalid.');
                setDbUser(null);
            } else if (res.status === 404) {
                console.warn('User mapping not found in DB. Redirecting to login.');
                supabase.auth.signOut();
            } else {
                const errorData = await res.json();
                console.error('Error fetching DB user:', errorData.error || res.statusText);
            }
        } catch (err) {
            console.error('Network error fetching DB user:', err);
        }
    };

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.access_token) {
                fetchDbUser(session.access_token);
            }
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.access_token) {
                fetchDbUser(session.access_token);
            } else {
                setDbUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        dbUser,
        session,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
