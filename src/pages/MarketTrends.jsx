import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import { apiUrl } from '../services/api';
import { TrendingUp, Award, DollarSign, Zap, ChevronRight, Loader2, Search } from 'lucide-react';
import '../styles/dashboard.css';

function MarketTrends() {
    const [activeTab, setActiveTab] = useState('free'); // free, paid, grossing
    const [selectedCategory, setSelectedCategory] = useState('FINANCE');
    const [trendingApps, setTrendingApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);

    const getCollectionName = (tab) => {
        switch (tab) {
            case 'free': return 'TOP_FREE_IOS';
            case 'paid': return 'TOP_PAID_IOS';
            case 'grossing': return 'TOP_GROSSING_IOS';
            default: return 'TOP_FREE_IOS';
        }
    };

    const fetchTrends = useCallback(async () => {
        setLoading(true);
        setAiAnalysis(null);
        try {
            const res = await fetch(apiUrl(`/appstore/trends?collection=${getCollectionName(activeTab)}&category=${selectedCategory}`));
            if (res.ok) {
                const data = await res.json();
                setTrendingApps(data);
            }
        } catch (error) {
            console.error("Failed to fetch trends", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedCategory]);

    // Initial fetch
    useEffect(() => {
        fetchTrends();
    }, [fetchTrends]);

    const analyzeTrendsWithAI = async () => {
        setAnalyzing(true);
        try {
            // Simulate AI analysis for now, or call a real endpoint if we have one ready
            // In a real scenario, we'd send the top 10 apps to the /api/ai/analyze-market endpoint

            // Mock response for immediate feedback
            setTimeout(() => {
                setAiAnalysis({
                    summary: `The ${selectedCategory} category is currently dominated by apps focusing on personalized experiences and AI integration.`,
                    opportunities: [
                        "Niche down: Create a specialized calculator for freelancers.",
                        "Add AI insights: Users are loving breakdown explanations.",
                        "Community focus: Social features are trending in finance apps."
                    ],
                    gaps: "There is a lack of apps targeting 'Gen Z financial literacy' with gamification."
                });
                setAnalyzing(false);
            }, 2000);

        } catch (error) {
            console.error("AI Analysis failed", error);
            setAnalyzing(false);
        }
    };

    return (
        <>
            <Header title="Market Trends" />
            <main className="main-content">
                <div className="page-container">
                    <div className="dashboard-welcome">
                        <h1>Trend Spy 🕵️‍♂️</h1>
                        <p>Analyze top charts to find your next winning app idea.</p>
                    </div>

                    {/* Controls */}
                    <div className="quick-actions" style={{ marginBottom: 24, justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="tab-group" style={{ display: 'flex', gap: 12 }}>
                            <button
                                className={`btn ${activeTab === 'free' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('free')}
                            >
                                Top Free
                            </button>
                            <button
                                className={`btn ${activeTab === 'paid' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('paid')}
                            >
                                Top Paid
                            </button>
                            <button
                                className={`btn ${activeTab === 'grossing' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('grossing')}
                            >
                                Top Grossing
                            </button>
                        </div>

                        <select
                            className="input-field"
                            style={{ width: 200 }}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="FINANCE">Finance</option>
                            <option value="BUSINESS">Business</option>
                            <option value="UTILITIES">Utilities</option>
                            <option value="PRODUCTIVITY">Productivity</option>
                            <option value="EDUCATION">Education</option>
                            <option value="HEALTH_AND_FITNESS">Health & Fitness</option>
                            <option value="LIFESTYLE">Lifestyle</option>
                        </select>
                    </div>

                    {/* AI Analysis Section */}
                    <div className="chart-card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(45, 52, 54,0.4) 0%, rgba(0, 0, 0, 0.2) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3><Zap size={20} color="#FDCB6E" style={{ display: 'inline', marginRight: 8 }} />AI Opportunity Analyst</h3>
                                <p>Get AI-powered insights on why these apps are trending.</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={analyzeTrendsWithAI}
                                disabled={analyzing || loading || trendingApps.length === 0}
                            >
                                {analyzing ? <Loader2 className="spin" size={18} /> : <Zap size={18} />}
                                {analyzing ? 'Analyzing Market...' : 'Analyze These Trends'}
                            </button>
                        </div>

                        {aiAnalysis && (
                            <div className="analysis-results" style={{ padding: '0 20px 20px' }}>
                                <div style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                    <h4 style={{ color: '#00B894', marginBottom: 8 }}>Market Summary</h4>
                                    <p style={{ lineHeight: 1.6 }}>{aiAnalysis.summary}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                        <h4 style={{ color: '#0984E3', marginBottom: 8 }}>Opportunities 🚀</h4>
                                        <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                                            {aiAnalysis.opportunities.map((op, i) => <li key={i}>{op}</li>)}
                                        </ul>
                                    </div>
                                    <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                        <h4 style={{ color: '#FF7675', marginBottom: 8 }}>Market Gaps 📉</h4>
                                        <p>{aiAnalysis.gaps}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* App List */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Loader2 className="spin" size={40} style={{ color: 'var(--primary-color)' }} />
                            <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Fetching live market data...</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid">
                            {trendingApps.map((app, index) => (
                                <div key={app.id || index} className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className="rank-badge" style={{
                                            background: index < 3 ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            width: 28, height: 28,
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '0.9rem'
                                        }}>
                                            {index + 1}
                                        </div>
                                        {activeTab === 'paid' && <div className="price-tag" style={{ color: '#00B894', fontWeight: 600 }}>{app.price || '$0.99'}</div>}
                                    </div>

                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <img src={app.icon} alt={app.title} style={{ width: 64, height: 64, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', lineHeight: 1.3 }}>{app.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.developer}</p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', width: '100%', display: 'flex', gap: 8 }}>
                                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', textAlign: 'center' }}>
                                            ⭐ {app.score?.toFixed(1) || 'N/A'}
                                        </div>
                                        <button className="btn-sm" style={{ padding: '4px 8px', background: 'var(--primary-color)', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                                            Spy <Search size={12} style={{ marginLeft: 4 }} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default MarketTrends;
