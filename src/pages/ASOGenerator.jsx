import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Copy,
    FileText,
    Image,
    Search,
    Sparkles,
    Target,
} from 'lucide-react';
import '../styles/aso-generator.css';

const applaaContent = {
    titles: [
        'AI App Builder for Kids UK',
        'Kids Coding With AI',
        'UKMT Practice With AI Tutor',
        '11 Plus AI Practice',
        'Build Real Apps With Applaa',
    ],
    subtitles: [
        'Learn coding and school subjects',
        'Create apps, games, and projects',
        'Reception to A-Level learning',
        'Verified Olympiad practice',
        'AI tutor for curious children',
    ],
    keywords: [
        { keyword: 'AI app builder for kids UK', type: 'long-tail', difficulty: 30, relevance: 98 },
        { keyword: 'AI coding app for kids', type: 'long-tail', difficulty: 36, relevance: 96 },
        { keyword: 'UKMT past papers with solutions', type: 'content', difficulty: 42, relevance: 94 },
        { keyword: '11 plus AI practice', type: 'content', difficulty: 45, relevance: 90 },
        { keyword: 'coding app for kids build games', type: 'long-tail', difficulty: 40, relevance: 92 },
    ],
    description: 'Applaa helps children learn, build, and prepare for exams in one desktop app. The SEO content should position Applaa around AI app creation for kids, verified UK exam practice, UKMT/BMO support, and parent-friendly learning from age 3 to Year 13.',
    screenshotHeadlines: ['Build real apps with AI', 'Learn UK subjects daily', 'Practice real UKMT papers', 'AI tutor for every lesson', 'Parent dashboard included', 'Offline-friendly desktop app'],
    iconConcepts: [
        { name: 'Pi Builder', description: 'Friendly AI builder mark for children', colors: ['#6C5CE7', '#00B894'] },
        { name: 'Learn Build Earn', description: 'Three-part education and creation symbol', colors: ['#0984E3', '#FDCB6E'] },
    ],
    months: [
        { month: 1, theme: 'SEO foundation', tasks: ['Audit applaa.com', 'Create AI coding landing page', 'Publish UKMT cluster'], kpis: ['10 briefs', '5 link gaps'] },
        { month: 2, theme: 'Education authority', tasks: ['Comparison pages', 'Parent content', 'Tutor outreach'], kpis: ['25 prospects', '4 pages'] },
        { month: 3, theme: 'AI/GEO readiness', tasks: ['FAQ schema', 'llms.txt', 'Answer-first blocks'], kpis: ['Snippets live', 'GEO blocks ready'] },
    ],
};

const sanathanContent = {
    titles: [
        'Daily Panchang App',
        'AI Guruji and Kundli',
        'Daily Puja Guide App',
        'Online Sloka Classes',
        'Sanathan Spiritual Guide',
    ],
    subtitles: [
        'Quote, Panchang, Puja and Guruji',
        'Daily Hindu spiritual companion',
        'Kundli, horoscope and classes',
        'Bal Sanskar and Yoga online',
        'Festival guide with reminders',
    ],
    keywords: [
        { keyword: 'daily panchang app', type: 'long-tail', difficulty: 39, relevance: 97 },
        { keyword: 'AI Guruji app', type: 'long-tail', difficulty: 32, relevance: 96 },
        { keyword: 'basic kundli app free', type: 'content', difficulty: 48, relevance: 91 },
        { keyword: 'online sloka classes for kids', type: 'content', difficulty: 44, relevance: 94 },
        { keyword: 'daily puja guide app', type: 'long-tail', difficulty: 36, relevance: 93 },
    ],
    description: 'Sanathan App should be positioned as a daily Hindu spiritual companion. The first content plan should cover daily quote, Panchang, festivals, puja guide, Japa counter, AI Guruji, Kundli, Sloka classes, Bal Sanskar, Yoga and Meditation, replays, Pro plans, referral, and OTP registration.',
    screenshotHeadlines: ['Today’s Panchang in one view', 'Daily Puja Guide', 'Ask AI Guruji', 'Track Japa daily', 'Bal Sanskar live classes', 'Replay missed sessions'],
    iconConcepts: [
        { name: 'Daily Jyoti', description: 'Lamp-inspired spiritual daily guide', colors: ['#F59E0B', '#8B5CF6'] },
        { name: 'Guruji Circle', description: 'Calm guidance and meditation mark', colors: ['#00B894', '#0984E3'] },
    ],
    months: [
        { month: 1, theme: 'MVP home', tasks: ['Quote library', 'Panchang widget', 'Festival guide'], kpis: ['365 quotes', 'Daily push ready'] },
        { month: 2, theme: 'Spiritual practice', tasks: ['Puja guide CMS', 'Japa counter', 'Wallpaper action'], kpis: ['7 day-wise guides', 'Retention loop'] },
        { month: 3, theme: 'Classes and Pro', tasks: ['Live reminders', 'Replay archive', 'Kundli Pro split'], kpis: ['Week archive', 'Rs. 99/mo plan'] },
    ],
};

function ASOGenerator() {
    const { currentApp } = useAppStore();
    const [expandedSections, setExpandedSections] = useState({
        titles: true,
        keywords: true,
        description: true,
        screenshots: true,
        strategy: true,
    });
    const content = currentApp?.id === 'sanathan' ? sanathanContent : applaaContent;

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Header title="Content Planner" />
            <main className="main-content">
                <div className="page-container">
                    <div className="generator-card">
                        <div className="card-header-icon">
                            <div className="icon-wrapper gradient">
                                <Sparkles size={28} />
                            </div>
                            <div>
                                <h2>{currentApp.name} SEO Content Package</h2>
                                <p>Working titles, keyword targets, content copy, creative angles, and 90-day action plan.</p>
                            </div>
                        </div>
                    </div>

                    <div className="results-section">
                        <div className="result-card">
                            <div className="result-header" onClick={() => toggleSection('titles')}>
                                <div className="result-title"><Target size={20} /><h3>Page Titles and Subtitles</h3></div>
                                {expandedSections.titles ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {expandedSections.titles && (
                                <div className="result-content">
                                    <div className="titles-grid">
                                        <div>
                                            <h4>Title Options</h4>
                                            {content.titles.map((title) => (
                                                <div key={title} className="copyable-item">
                                                    <span>{title}</span>
                                                    <button onClick={() => copyToClipboard(title)}><Copy size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h4>Subtitle Options</h4>
                                            {content.subtitles.map((subtitle) => (
                                                <div key={subtitle} className="copyable-item">
                                                    <span>{subtitle}</span>
                                                    <button onClick={() => copyToClipboard(subtitle)}><Copy size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="result-card">
                            <div className="result-header" onClick={() => toggleSection('keywords')}>
                                <div className="result-title"><Search size={20} /><h3>Priority Keywords</h3></div>
                                {expandedSections.keywords ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {expandedSections.keywords && (
                                <div className="result-content">
                                    <table className="keywords-table">
                                        <thead>
                                            <tr><th>Keyword</th><th>Type</th><th>Difficulty</th><th>Relevance</th></tr>
                                        </thead>
                                        <tbody>
                                            {content.keywords.map((keyword) => (
                                                <tr key={keyword.keyword}>
                                                    <td>{keyword.keyword}</td>
                                                    <td><span className={`badge ${keyword.type}`}>{keyword.type}</span></td>
                                                    <td>{keyword.difficulty}</td>
                                                    <td>{keyword.relevance}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="result-card">
                            <div className="result-header" onClick={() => toggleSection('description')}>
                                <div className="result-title"><FileText size={20} /><h3>Content Direction</h3></div>
                                {expandedSections.description ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {expandedSections.description && (
                                <div className="result-content">
                                    <div className="description-box">
                                        <pre>{content.description}</pre>
                                        <button className="btn btn-secondary" onClick={() => copyToClipboard(content.description)}>
                                            <Copy size={16} /> Copy Direction
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="result-card">
                            <div className="result-header" onClick={() => toggleSection('screenshots')}>
                                <div className="result-title"><Image size={20} /><h3>Creative Angles</h3></div>
                                {expandedSections.screenshots ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {expandedSections.screenshots && (
                                <div className="result-content">
                                    <div className="screenshots-grid">
                                        <div>
                                            <h4>Screen Headlines</h4>
                                            <div className="headlines-list">
                                                {content.screenshotHeadlines.map((headline, index) => (
                                                    <div key={headline} className="headline-item">
                                                        <span className="num">{index + 1}</span>
                                                        <span>{headline}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4>Icon Concepts</h4>
                                            <div className="icons-list">
                                                {content.iconConcepts.map((icon) => (
                                                    <div key={icon.name} className="icon-concept">
                                                        <div className="icon-preview" style={{ background: `linear-gradient(135deg, ${icon.colors[0]}, ${icon.colors[1]})` }} />
                                                        <div>
                                                            <strong>{icon.name}</strong>
                                                            <p>{icon.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="result-card">
                            <div className="result-header" onClick={() => toggleSection('strategy')}>
                                <div className="result-title"><Calendar size={20} /><h3>90-Day Plan</h3></div>
                                {expandedSections.strategy ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {expandedSections.strategy && (
                                <div className="result-content">
                                    <div className="strategy-timeline">
                                        {content.months.map((month) => (
                                            <div key={month.month} className="timeline-item">
                                                <div className="timeline-month">Month {month.month}</div>
                                                <div className="timeline-content">
                                                    <h4>{month.theme}</h4>
                                                    <ul>{month.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                                                    <div className="kpis">KPIs: {month.kpis.join(', ')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ASOGenerator;
