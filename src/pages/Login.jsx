import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../services/auth';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import '../styles/main.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from);
        }
    }, [user, navigate, location]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            // Auth state listener in App.jsx will handle navigation
        } catch (err) {
            console.error(err);
            setError('Failed to sign in with Google');
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password, name);
            }
        } catch (err) {
            console.error(err);
            // Firebase error codes map
            if (err.code === 'auth/invalid-credential') setError('Invalid email or password');
            else if (err.code === 'auth/email-already-in-use') setError('Email already in use');
            else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters');
            else setError(err.message || 'Authentication failed');
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
                        {isLogin ? 'Enter your credentials to access your dashboard' : 'Start your app growth journey today'}
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

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn-google"
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'white',
                        color: '#2d3436',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: 20,
                        transition: 'transform 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? <Loader2 className="spin" size={20} /> : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Sign in with Google
                        </>
                    )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: 20 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>OR EMAIL</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                {/* Form */}
                <form onSubmit={handleEmailAuth}>
                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
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
