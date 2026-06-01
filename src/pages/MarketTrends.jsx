import React from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import { sanathanMvpModules } from '../data/projects';
import { Bell, CalendarDays, CheckCircle, Mail, PlayCircle, Sparkles, Users, Zap } from 'lucide-react';
import '../styles/dashboard.css';

const applaaPlan = [
    {
        phase: 'Days 1-30',
        theme: 'SEO foundation',
        actions: ['Audit applaa.com', 'Create AI coding for kids landing page', 'Publish UKMT and 11 plus topic clusters'],
        kpis: ['21 tracked keywords', '5 competitor backlink gaps', '10 article briefs'],
    },
    {
        phase: 'Days 31-60',
        theme: 'Education authority',
        actions: ["Comparison pages vs IXL, Code.org, Tynker, BYJU'S", 'Parent-focused content', 'School and tutor outreach'],
        kpis: ['25 backlink prospects', '8 outreach drafts', '4 landing pages'],
    },
    {
        phase: 'Days 61-90',
        theme: 'GEO visibility',
        actions: ['FAQ schema', 'llms.txt', 'answer-first content blocks', 'AI search snippets'],
        kpis: ['Rich snippets ready', 'AI answer blocks live', 'Monthly content calendar'],
    },
];

const sanathanRetention = [
    'Morning Panchang notification with festival and fasting guide',
    'Daily quote and day-wise chant reminder',
    'Class reminder 30 minutes before Bal Sanskar or Yoga/Meditation',
    'Replay available notification after each class',
    'Weekly parent email with recordings and upcoming spiritual calendar',
    'Monthly Pro prompt for Advanced Kundli and AI Guruji',
    'Yearly plan offer at Rs. 999 with two months free',
    'Referral reward after five real user onboardings',
    'OTP registration to reduce fake users',
];

function MarketTrends() {
    const { currentApp } = useAppStore();
    const isSanathan = currentApp?.id === 'sanathan';
    const plan = isSanathan ? sanathanMvpModules.map((item, index) => ({
        phase: `MVP ${index + 1}`,
        theme: item.title,
        actions: [item.detail],
        kpis: [item.status],
    })) : applaaPlan;

    return (
        <>
            <Header title={isSanathan ? 'Sanathan MVP Plan' : 'Applaa Growth Plan'} />
            <main className="main-content">
                <div className="page-container">
                    <div className="dashboard-welcome">
                        <h1>{isSanathan ? 'Sanathan First-Round MVP' : 'Applaa 30/60/90 SEO Plan'}</h1>
                        <p>{currentApp.focus}</p>
                    </div>

                    <div className="dashboard-grid">
                        {(isSanathan ? [
                            ['Free Tier', 'Basic Kundli and basic AI Guruji advice'],
                            ['Pro Monthly', 'Rs. 99/month for advanced Kundli and AI Guruji'],
                            ['Pro Yearly', 'Rs. 999/year with two months free'],
                            ['Registration', 'OTP-only signup to avoid scam users'],
                        ] : [
                            ['Primary Market', 'United Kingdom education and parent search'],
                            ['Secondary Markets', 'India, USA, Ireland, Australia, Canada'],
                            ['Core Offer', 'AI app builder plus full academic academy'],
                            ['Authority Angle', 'Verified UKMT/BMO papers and exam-board coverage'],
                        ]).map(([title, value]) => (
                            <div className="stat-card" key={title}>
                                <div className="stat-header">
                                    <span className="stat-title">{title}</span>
                                    <div className="stat-icon"><Sparkles size={20} /></div>
                                </div>
                                <div className="stat-value" style={{ fontSize: '1.25rem', lineHeight: 1.35 }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="chart-card" style={{ marginTop: 24 }}>
                        <div className="chart-header">
                            <div className="chart-title">
                                <h3>{isSanathan ? 'MVP Modules' : 'SEO Roadmap'}</h3>
                                <p>{isSanathan ? 'Daily spiritual engagement and Pro conversion scope' : 'Priority work before public promotion'}</p>
                            </div>
                        </div>
                        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                            {plan.map((item) => (
                                <div key={item.phase} className="stat-card" style={{ minHeight: 180 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem' }}>{item.phase}</h3>
                                        <span className="nav-item-badge new">{item.theme}</span>
                                    </div>
                                    <ul style={{ paddingLeft: 18, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                                        {item.actions.map((action) => <li key={action}>{action}</li>)}
                                    </ul>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {item.kpis.map((kpi) => <span key={kpi} className="channel-tag">{kpi}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isSanathan && (
                        <div className="chart-card" style={{ marginTop: 24 }}>
                            <div className="chart-header">
                                <div className="chart-title">
                                    <h3>Retention and Notification System</h3>
                                    <p>Week-wise, month-wise, and yearly engagement loops for parents and spiritual users</p>
                                </div>
                            </div>
                            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                                {sanathanRetention.map((item, index) => {
                                    const Icon = [Bell, CalendarDays, PlayCircle, Mail, Users, Zap, CheckCircle][index % 7];
                                    return (
                                        <div className="activity-item" key={item} style={{ alignItems: 'flex-start' }}>
                                            <div className="activity-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#A78BFA' }}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-title">{item}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default MarketTrends;
