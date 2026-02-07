import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Loader2 } from 'lucide-react';

const AuthGuard = ({ children }) => {
    const { user, authLoading } = useAppStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { state: { from: location } });
        }
    }, [user, authLoading, navigate, location]);

    if (authLoading) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <Loader2 className="spin" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    return user ? children : null;
};

export default AuthGuard;
