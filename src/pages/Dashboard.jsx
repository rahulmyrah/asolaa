import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    BookOpen,
    CalendarDays,
    FileText,
    Globe2,
    Hash,
    MessageSquare,
    Search,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

function Dashboard() {
    const { currentApp, reviews, history, keywords } = useAppStore();
    const [performanceTab, setPerformanceTab] = useState('score');
    const isSanathan = currentApp?.id === 'sanathan';

    const historyLabels = history.map((item) => new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

    const scoreHistoryData = {
        labels: historyLabels,
        datasets: [{
            label: 'SEO/GEO Readiness',
            data: history.map((item) => item.rating),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.12)',
            tension: 0.4,
            fill: true,
        }],
    };

    const activityData = {
        labels: historyLabels,
        datasets: [{
            label: 'Team Updates',
            data: history.map((item) => item.reviews),
            backgroundColor: '#00B894',
            borderRadius: 4,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(255,255,255,0.06)' } },
        },
    };

    const projectKeywords = keywords.filter((keyword) => keyword.project === currentApp.name).slice(0, 5);
    const modules = currentApp.mvpModules || currentApp.roadmap.map((item) => ({ title: item, status: 'SEO', detail: currentApp.focus }));

    return (
        <>
            <Header title="Growth Dashboard" />
            <main className="main-content">
                <div className="page-container">
                    <div className="dashboard-welcome">
                        <h1>{currentApp.name} Growth Workspace</h1>
                        <p>{currentApp.focus}</p>
                    </div>

                    <div className="quick-actions">
                        <button className="action-btn" onClick={() => window.location.href = '/seo-geo'}>
                            <div className="icon-wrapper gradient">
                                <Globe2 size={24} />
                            </div>
                            <span>Run SEO/GEO Audit</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/keyword-research'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)' }}>
                                <Search size={24} />
                            </div>
                            <span>Keyword Clusters</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/competitors'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #FDCB6E 0%, #E17055 100%)' }}>
                                <Users size={24} />
                            </div>
                            <span>Competitor Links</span>
                        </button>
                        <button className="action-btn" onClick={() => window.location.href = '/market-trends'}>
                            <div className="icon-wrapper gradient" style={{ background: 'linear-gradient(135deg, #FF7675 0%, #D63031 100%)' }}>
                                <CalendarDays size={24} />
                            </div>
                            <span>{isSanathan ? 'MVP Calendar' : 'Content Roadmap'}</span>
                        </button>
                    </div>

                    <div className="connect-banner">
                        <div className="connect-banner-content">
                            <div className="banner-icon">
                                {isSanathan ? <BookOpen size={24} /> : <Sparkles size={24} />}
                            </div>
                            <div>
                                <h3>{currentApp.title}</h3>
                                <p>{currentApp.subtitle}</p>
                            </div>
                        </div>
                        <a className="btn btn-primary" href={currentApp.website} target="_blank" rel="noreferrer">
                            Open Website
                        </a>
                    </div>

                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">SEO/GEO Score</span>
                                <div className="stat-icon"><Star size={20} /></div>
                            </div>
                            <div className="stat-value">{currentApp.asoScore}</div>
                            <div className="stat-change positive"><TrendingUp size={16} /> Current readiness</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">Tracked Keywords</span>
                                <div className="stat-icon" style={{ color: '#00B894', background: 'rgba(0, 184, 148, 0.1)' }}>
                                    <Hash size={20} />
                                </div>
                            </div>
                            <div className="stat-value">{currentApp.totalKeywords}</div>
                            <div className="stat-change positive"><TrendingUp size={16} /> +{currentApp.keywordChange} this sprint</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">{isSanathan ? 'Pro Plan' : 'Launch Stage'}</span>
                                <div className="stat-icon" style={{ color: '#0984E3', background: 'rgba(9, 132, 227, 0.1)' }}>
                                    <Zap size={20} />
                                </div>
                            </div>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{currentApp.revenue}</div>
                            <div className="stat-change neutral">{currentApp.version}</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">Status</span>
                                <div className="stat-icon" style={{ color: '#E17055', background: 'rgba(225, 112, 85, 0.1)' }}>
                                    <FileText size={20} />
                                </div>
                            </div>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{currentApp.categoryRank}</div>
                            <div className="stat-change positive"><TrendingUp size={16} /> {currentApp.downloads}</div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>{isSanathan ? 'MVP Readiness' : 'SEO Readiness'}</h3>
                                <p>Internal progress signal for this project</p>
                            </div>
                            <div className="chart-actions">
                                <button
                                    className={`btn-sm ${performanceTab === 'score' ? 'active' : ''}`}
                                    onClick={() => setPerformanceTab('score')}
                                    style={{ marginRight: 8, padding: '4px 8px', borderRadius: 4, background: performanceTab === 'score' ? 'var(--primary-color)' : 'transparent', color: performanceTab === 'score' ? 'white' : 'inherit', border: '1px solid var(--border-color)' }}
                                >
                                    Score
                                </button>
                                <button
                                    className={`btn-sm ${performanceTab === 'updates' ? 'active' : ''}`}
                                    onClick={() => setPerformanceTab('updates')}
                                    style={{ padding: '4px 8px', borderRadius: 4, background: performanceTab === 'updates' ? 'var(--primary-color)' : 'transparent', color: performanceTab === 'updates' ? 'white' : 'inherit', border: '1px solid var(--border-color)' }}
                                >
                                    Updates
                                </button>
                            </div>
                        </div>
                        <div className="chart-container" style={{ padding: '0 20px 20px', height: 250 }}>
                            {performanceTab === 'score'
                                ? <Line data={scoreHistoryData} options={chartOptions} />
                                : <Bar data={activityData} options={chartOptions} />}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>{isSanathan ? 'Sanathan MVP Modules' : 'Applaa SEO Roadmap'}</h3>
                                <p>{isSanathan ? 'First-round MVP scope for daily engagement and Pro conversion' : 'Priority content and authority-building work'}</p>
                            </div>
                        </div>
                        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                            {modules.map((module) => (
                                <div key={module.title} className="stat-card" style={{ minHeight: 130 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                        <h4 style={{ margin: 0 }}>{module.title}</h4>
                                        <span className="nav-item-badge new">{module.status}</span>
                                    </div>
                                    <p style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{module.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Priority Keywords</h3>
                                <p>Seed terms for SEO, GEO, content briefs, and backlink anchor planning</p>
                            </div>
                        </div>
                        <div className="activity-list">
                            {projectKeywords.map((keyword) => (
                                <div key={keyword.id} className="activity-item">
                                    <div className="activity-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#A78BFA' }}>
                                        <Search size={18} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">{keyword.keyword}</div>
                                        <div className="activity-time" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                            Rank target #{keyword.rank} | +{keyword.change} sprint priority
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>Team Notes</h3>
                                <p>Latest internal planning updates</p>
                            </div>
                        </div>
                        <div className="activity-list">
                            {reviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="activity-item">
                                    <div className="activity-icon" style={{ background: review.replied ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)', color: review.replied ? '#34D399' : '#FBBF24' }}>
                                        <MessageSquare size={18} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">{review.author}</div>
                                        <div className="activity-time" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                            {review.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Dashboard;
