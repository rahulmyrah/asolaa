import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { loginWithEmail, registerWithEmail } from '../services/auth';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, Sparkles, ShieldCheck, User } from 'lucide-react';
import '../styles/main.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from);
        }
    }, [user, navigate, location]);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let authenticatedUser;
            if (isLogin) {
                authenticatedUser = await loginWithEmail(email, password);
            } else {
                authenticatedUser = await registerWithEmail(email, password, name, inviteCode);
            }
            useAppStore.getState().setUser(authenticatedUser);
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Authentication failed');
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, #2d3436 0%, #000000 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'var(--secondary-color)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1 }}></div>

            <div className="login-card" style={{
                width: '100%',
                maxWidth: 420,
                padding: 40,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{
                        width: 60, height: 60,
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 10px 20px rgba(0, 184, 148, 0.3)'
                    }}>
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Enter your internal ASOLAA credentials' : 'Create an internal SEO team account'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        background: 'rgba(255, 118, 117, 0.1)',
                        border: '1px solid rgba(255, 118, 117, 0.2)',
                        color: '#ff7675',
                        padding: '12px 16px',
                        borderRadius: 12,
                        fontSize: '0.9rem',
                        marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 10
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', marginBottom: 20, padding: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.16)', borderRadius: 12 }}>
                    <ShieldCheck size={18} color="#34D399" />
                    <span style={{ fontSize: '0.86rem' }}>Authentication is managed by your private Neon Postgres database.</span>
                </div>

                {/* Form */}
                <form onSubmit={handleEmailAuth}>
                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    placeholder="Internal signup code (if enabled)"
                                    value={inviteCode}
                                    onChange={e => setInviteCode(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group" style={{ marginBottom: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 24 }}>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        {loading ? <Loader2 className="spin" /> : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;
