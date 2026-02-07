import React, { useState } from 'react';
import Header from '../components/Header';
import ConnectAppModal from '../components/ConnectAppModal';
import { useAppStore } from '../store/appStore';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    Info,
    ChevronDown,
    Star,
    Reply,
    CheckCircle,
    AlertCircle,
    Globe,
    Calendar,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Users,
    Download,
    MessageSquare,
    Search,
    Zap,
    Loader2
} from 'lucide-react';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
    const { currentApp, reviews, ratings, selectedCountry, dateRange, isLoading, history, fetchHistory, user } = useAppStore();
    const [performanceTab, setPerformanceTab] = useState('rating'); // 'rating' or 'reviews'
    const [showConnectModal, setShowConnectModal] = useState(false);

    // Check for openConnect query param
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('openConnect') === 'true') {
            setShowConnectModal(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Fetch history when app changes
    React.useEffect(() => {
        if (user && currentApp?.id) {
            fetchHistory(currentApp.id);
        }
    }, [currentApp?.id, user]);

    // Format history for charts
    const historyLabels = history?.length > 0
        ? history.map(h => new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
        : Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });

    const ratingHistoryData = {
        labels: historyLabels,
        datasets: [{
            label: 'Average Rating',
            data: history?.length > 0
                ? history.map(h => h.rating)
                : Array(7).fill(ratings.average || 0),
            borderColor: '#00B894',
            backgroundColor: 'rgba(0, 184, 148, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const reviewHistoryData = {
        labels: historyLabels,
        datasets: [{
            label: 'Total Reviews',
            data: history?.length > 0
                ? history.map(h => h.reviews)
                : Array(7).fill(reviews.length || 0),
            backgroundColor: '#0984E3',
            borderRadius: 4
        }]
    };

    const ratingDistData = {
        labels: ['5★', '4★', '3★', '2★', '1★'],
        datasets: [
            {
                data: [
                    ratings.distribution[5],
                    ratings.distribution[4],
                    ratings.distribution[3],
                    ratings.distribution[2],
                    ratings.distribution[1],
                ],
                backgroundColor: '#00B894',
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' } }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="spin" size={48} style={{ color: 'var(--primary-color)', marginBottom: 16 }} />
                    <h2>Syncing Real-Time Data...</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Fetching latest stats from the App Store</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header title="Dashboard" />
            <main className="main-content">
                <div className="page-container">
                    {/* Welcome Section */}
                    <div className="dashboard-welcome">
                        <h1>Welcome back, Rahul</h1>
                        <p>Here's what's happening with <strong>{currentApp?.name || 'your apps'}</strong> today.</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <button className="action-btn" onClick={() => window.location.href = '/aso-generator'}>
                            <div className="icon-wrapper gradient">
                                <Sparkles size={24} />
                            </div>
                            <span>ASO Generator</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/keyword-research'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)' }}>
                                <Search size={24} />
                            </div>
                            <span>Keyword Research</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/reviews'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)' }}>
                                <MessageSquare size={24} />
                            </div>
                            <span>Manage Reviews</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/competitors'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #FDCB6E 0%, #E17055 100%)' }}>
                                <Users size={24} />
                            </div>
                            <span>Competitor Spy</span>
                        </button>
                    </div>

                    {/* Connect App Banner */}
                    <div className="connect-banner">
                        <div className="connect-banner-content">
                            {currentApp?.icon ? (
                                <img src={currentApp.icon} alt="App Icon" style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }} />
                            ) : (
                                <div className="banner-icon">
                                    <Zap size={24} />
                                </div>
                            )}
                            <div>
                                <h3>{currentApp?.bundleId !== 'com.finlaa.aisuite' ? 'App Connected: ' + currentApp.name : 'Connect your app to view real-time data'}</h3>
                                <p>{currentApp?.bundleId !== 'com.finlaa.aisuite' ? `Tracking real-time performance for ${currentApp.version}` : 'Unlock powerful insights about your app store performance and ASO impact.'}</p>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowConnectModal(true)}>
                            {currentApp?.bundleId !== 'com.finlaa.aisuite' ? 'Switch App' : 'Connect App'}
                        </button>
                    </div>

                    {/* Charts Grid */}
                    <div className="charts-grid">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Performance History</h3>
                                <p>Track your growth over time</p>
                            </div>
                            <div className="chart-actions">
                                <button
                                    className={`btn-sm ${performanceTab === 'rating' ? 'active' : ''}`}
                                    onClick={() => setPerformanceTab('rating')}
                                    style={{ marginRight: 8, padding: '4px 8px', borderRadius: 4, background: performanceTab === 'rating' ? 'var(--primary-color)' : 'transparent', color: performanceTab === 'rating' ? 'white' : 'inherit', border: '1px solid var(--border-color)' }}
                                >
                                    Rating
                                </button>
                                <button
                                    className={`btn-sm ${performanceTab === 'reviews' ? 'active' : ''}`}
                                    onClick={() => setPerformanceTab('reviews')}
                                    style={{ padding: '4px 8px', borderRadius: 4, background: performanceTab === 'reviews' ? 'var(--primary-color)' : 'transparent', color: performanceTab === 'reviews' ? 'white' : 'inherit', border: '1px solid var(--border-color)' }}
                                >
                                    Reviews
                                </button>
                            </div>
                        </div>
                        <div className="chart-container" style={{ padding: '0 20px 20px', height: 250 }}>
                            {performanceTab === 'rating' ? (
                                <Line data={ratingHistoryData} options={chartOptions} />
                            ) : (
                                <Bar data={reviewHistoryData} options={chartOptions} />
                            )}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Ratings Distribution</h3>
                                <p>Based on last {ratings.total} ratings</p>
                            </div>
                        </div>
                        <div className="chart-container" style={{ padding: '0 20px 20px' }}>
                            <Bar
                                data={ratingDistData}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { x: { display: false }, y: { grid: { display: false } } }
                                }}
                            />
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Values & Sentiment</h3>
                                <p>Latest user feedback highlights</p>
                            </div>
                        </div>
                        <div className="activity-list">
                            {reviews.length > 0 ? reviews.slice(0, 3).map((review, i) => (
                                <div key={i} className="activity-item">
                                    <div className="activity-icon" style={{ background: review.rating >= 4 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 113, 133, 0.1)', color: review.rating >= 4 ? '#34D399' : '#FB7185' }}>
                                        <Star size={18} fill="currentColor" />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">{review.rating}★ from {review.author}</div>
                                        <div className="activity-time" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                            "{review.content.substring(0, 40)}{review.content.length > 40 ? '...' : ''}"
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No recent reviews found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="dashboard-grid">
                    {/* Ratings Card */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Average Rating</span>
                            <div className="stat-icon">
                                <Star size={20} />
                            </div>
                        </div>
                        <div className="stat-value">{ratings.average.toFixed(1)}</div>
                        <div className="stat-change positive">
                            <TrendingUp size={16} />
                            Based on {ratings.total} ratings
                        </div>
                    </div>

                    {/* Reviews Card */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Total Reviews</span>
                            <div className="stat-icon" style={{ color: '#00B894', background: 'rgba(0, 184, 148, 0.1)' }}>
                                <MessageSquare size={20} />
                            </div>
                        </div>
                        <div className="stat-value">{reviews.length}</div>
                        <div className="stat-change positive">
                            <TrendingUp size={16} />
                            Latest: {reviews[0]?.date || 'N/A'}
                        </div>
                    </div>

                    {/* Visibility Card */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">App Version</span>
                            <div className="stat-icon" style={{ color: '#0984E3', background: 'rgba(9, 132, 227, 0.1)' }}>
                                <Info size={20} />
                            </div>
                        </div>
                        <div className="stat-value" style={{ fontSize: '1.5rem' }}>{currentApp?.version || 'N/A'}</div>
                        <div className="stat-change neutral">
                            Updated: {currentApp?.updated ? new Date(currentApp.updated).toLocaleDateString() : 'Unknown'}
                        </div>
                    </div>

                    {/* Downloads Card */}
                    <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Installs</span>
                            <div className="stat-icon" style={{ color: '#E17055', background: 'rgba(225, 112, 85, 0.1)' }}>
                                <Download size={20} />
                            </div>
                        </div>
                        <div className="stat-value">{currentApp?.downloads || 'N/A'}</div>
                        <div className="stat-change positive">
                            <TrendingUp size={16} />
                            est. total
                        </div>
                    </div>
                </div>
            </div>
        </main >

            {/* Connect Modal */ }
    {
        showConnectModal && (
            <ConnectAppModal onClose={() => setShowConnectModal(false)} />
        )
    }
        </>
    );
}

export default Dashboard;
