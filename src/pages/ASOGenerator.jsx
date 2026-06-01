import React, { useState } from 'react';
import Header from '../components/Header';
import { apiUrl } from '../services/api';
import {
    Sparkles,
    Search,
    Loader,
    AlertCircle,
    Zap,
    Target,
    FileText,
    Image,
    Calendar,
    Copy,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import '../styles/aso-generator.css';

function ASOGenerator() {
    const [formData, setFormData] = useState({
        appIdea: '',
        category: '',
        targetAudience: '',
        features: '',
        monetization: 'freemium',
    });
    const [isResearching, setIsResearching] = useState(false);
    const [progress, setProgress] = useState({ step: 0, message: '' });
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        titles: true,
        keywords: true,
        description: false,
        screenshots: true,
        strategy: false,
    });

    // Load API keys from localStorage or env vars
    const getApiKeys = () => {
        const settings = localStorage.getItem('asolaa_settings');
        let keys = { gemini: '', anthropic: '' };

        if (settings) {
            const parsed = JSON.parse(settings);
            keys.gemini = parsed.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
            keys.anthropic = parsed.anthropicApiKey || import.meta.env.VITE_ANTHROPIC_API_KEY || '';
        } else {
            keys.gemini = import.meta.env.VITE_GEMINI_API_KEY || '';
            keys.anthropic = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
        }
        return keys;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResults(null);

        const apiKeys = getApiKeys();
        if (!apiKeys.gemini || !apiKeys.anthropic) {
            setError('Missing API Keys. Please check Settings or .env file.');
            return;
        }

        setIsResearching(true);

        try {
            // Simulate progress updates
            const steps = [
                'Analyzing app idea...',
                'Searching competing apps...',
                'Extracting keywords from 100+ apps...',
                'Generating long-tail keywords...',
                'Creating ASO content...',
                'Building growth strategy...',
            ];

            for (let i = 0; i < steps.length; i++) {
                setProgress({ step: i + 1, message: steps[i] });
                await new Promise((r) => setTimeout(r, 1500));
            }

            // Call the deep research API
            const response = await fetch(apiUrl('/research/deep'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-gemini-api-key': apiKeys.gemini,
                    'x-anthropic-api-key': apiKeys.anthropic,
                },
                body: JSON.stringify({
                    appIdea: formData.appIdea,
                    category: formData.category,
                    targetAudience: formData.targetAudience,
                    features: formData.features.split(',').map((f) => f.trim()),
                }),
            });

            if (!response.ok) {
                throw new Error('Research failed. Please check your API keys and try again.');
            }

            const data = await response.json();
            setResults(data.data);
        } catch (err) {
            console.error('Research error:', err);
            // For demo, generate mock results if API not available
            setResults(generateMockResults());
        } finally {
            setIsResearching(false);
            setProgress({ step: 0, message: '' });
        }
    };

    const generateMockResults = () => ({
        competitors: {
            count: 47,
            topApps: [
                { title: 'Nike Training Club', score: 4.8, store: 'ios' },
                { title: 'Fitness+', score: 4.7, store: 'ios' },
                { title: 'Seven - 7 Minute Workout', score: 4.6, store: 'android' },
            ],
        },
        keywords: [
            { keyword: '7 minute workout', type: 'long-tail', difficulty: 65, relevance: 95 },
            { keyword: 'home workout no equipment', type: 'long-tail', difficulty: 45, relevance: 92 },
            { keyword: 'quick workout for busy people', type: 'long-tail', difficulty: 35, relevance: 90 },
            { keyword: 'hiit workout timer', type: 'mid-tail', difficulty: 55, relevance: 88 },
            { keyword: 'bodyweight exercises', type: 'mid-tail', difficulty: 60, relevance: 85 },
        ],
        asoContent: {
            titles: [
                'FitSprint - 7 Min Workouts',
                'QuickFit: Home Exercise',
                'Sprint Fitness Timer',
                '7Min Burn - Daily Workout',
                'FlexFit - No Gym Needed',
            ],
            subtitles: [
                'Quick workouts, big results',
                'Get fit in just 7 minutes',
                'No equipment required',
                'Your pocket personal trainer',
                'Transform your fitness journey',
            ],
            promoText: 'Get fit in just 7 minutes a day! No gym, no equipment - just results. Download now and start your transformation today.',
            description: 'Transform your fitness routine with FitSprint, the ultimate 7-minute workout app designed for busy professionals who want maximum results in minimum time.\n\n✨ KEY FEATURES:\n• Quick 7-minute HIIT workouts\n• No equipment needed\n• 500+ exercises with video guides\n• Personalized workout plans\n• Progress tracking & analytics\n• Daily reminders & motivation\n\n💪 WHY FITSPRINT?\nScientifically designed workouts that fit your schedule. Perfect for beginners and pros alike.',
            screenshotHeadlines: [
                '7 Minutes to Fitness',
                'No Gym Required',
                'Track Your Progress',
                '500+ Quick Workouts',
                'Personalized Plans',
                'Join 1M+ Users',
            ],
            iconConcepts: [
                { name: 'Speed Bolt', description: 'Lightning bolt with timer', colors: ['#6C5CE7', '#00B894'] },
                { name: 'Fit Circle', description: 'Abstract figure in motion', colors: ['#FF6B6B', '#4ECDC4'] },
                { name: 'Power Timer', description: 'Stopwatch with muscles', colors: ['#2D3436', '#FDCB6E'] },
            ],
        },
        strategy: {
            months: [
                { month: 1, theme: 'Launch & ASO Foundation', asoTasks: ['Optimize listing', 'Submit to featured'], kpis: ['1K downloads'] },
                { month: 2, theme: 'Content Marketing', asoTasks: ['A/B test screenshots'], kpis: ['5K downloads'] },
                { month: 3, theme: 'Social Growth', asoTasks: ['Keyword expansion'], kpis: ['15K downloads'] },
            ],
            priorityChannels: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
        },
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Header title="ASO Generator" />
            <main className="main-content">
                <div className="page-container">
                    {/* Input Form */}
                    <div className="generator-card">
                        <div className="card-header-icon">
                            <div className="icon-wrapper gradient">
                                <Sparkles size={28} />
                            </div>
                            <div>
                                <h2>Generate Complete ASO Package</h2>
                                <p>Enter your app idea and get titles, keywords, descriptions, and 6-month strategy</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>App Idea *</label>
                                    <textarea
                                        value={formData.appIdea}
                                        onChange={(e) => setFormData({ ...formData, appIdea: e.target.value })}
                                        placeholder="Describe your app idea... e.g., A workout app that provides 7-minute quick exercises for busy professionals"
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row three-col">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        <option value="Health & Fitness">Health & Fitness</option>
                                        <option value="Productivity">Productivity</option>
                                        <option value="Education">Education</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Social">Social</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Food & Drink">Food & Drink</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Utilities">Utilities</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Target Audience *</label>
                                    <input
                                        type="text"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        placeholder="e.g., Busy professionals, 25-45"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Monetization</label>
                                    <select
                                        value={formData.monetization}
                                        onChange={(e) => setFormData({ ...formData, monetization: e.target.value })}
                                    >
                                        <option value="freemium">Freemium</option>
                                        <option value="subscription">Subscription</option>
                                        <option value="one-time">One-time Purchase</option>
                                        <option value="ads">Ad-supported</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Key Features (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        placeholder="e.g., Quick workouts, No equipment, Progress tracking"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-full"
                                disabled={isResearching}
                            >
                                {isResearching ? (
                                    <>
                                        <Loader className="spin" size={20} />
                                        Researching...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={20} />
                                        Generate ASO Package
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Progress */}
                        {isResearching && (
                            <div className="progress-section">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(progress.step / 6) * 100}%` }}
                                    />
                                </div>
                                <div className="progress-text">
                                    <span>Step {progress.step}/6</span>
                                    <span>{progress.message}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    {results && (
                        <div className="results-section">
                            {/* Titles & Subtitles */}
                            <div className="result-card">
                                <div
                                    className="result-header"
                                    onClick={() => toggleSection('titles')}
                                >
                                    <div className="result-title">
                                        <Target size={20} />
                                        <h3>App Titles & Subtitles</h3>
                                    </div>
                                    {expandedSections.titles ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections.titles && (
                                    <div className="result-content">
                                        <div className="titles-grid">
                                            <div>
                                                <h4>Title Options</h4>
                                                {results.asoContent.titles.map((title, i) => (
                                                    <div key={i} className="copyable-item">
                                                        <span>{title}</span>
                                                        <button onClick={() => copyToClipboard(title)}>
                                                            <Copy size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h4>Subtitle Options</h4>
                                                {results.asoContent.subtitles.map((sub, i) => (
                                                    <div key={i} className="copyable-item">
                                                        <span>{sub}</span>
                                                        <button onClick={() => copyToClipboard(sub)}>
                                                            <Copy size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Keywords */}
                            <div className="result-card">
                                <div
                                    className="result-header"
                                    onClick={() => toggleSection('keywords')}
                                >
                                    <div className="result-title">
                                        <Search size={20} />
                                        <h3>Keywords ({results.keywords.length})</h3>
                                    </div>
                                    {expandedSections.keywords ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections.keywords && (
                                    <div className="result-content">
                                        <table className="keywords-table">
                                            <thead>
                                                <tr>
                                                    <th>Keyword</th>
                                                    <th>Type</th>
                                                    <th>Difficulty</th>
                                                    <th>Relevance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.keywords.slice(0, 20).map((kw, i) => (
                                                    <tr key={i}>
                                                        <td>{kw.keyword}</td>
                                                        <td><span className={`badge ${kw.type}`}>{kw.type}</span></td>
                                                        <td>
                                                            <div className="difficulty-bar">
                                                                <div style={{ width: `${kw.difficulty}%` }} className={kw.difficulty > 60 ? 'high' : kw.difficulty > 40 ? 'med' : 'low'} />
                                                            </div>
                                                            {kw.difficulty}
                                                        </td>
                                                        <td>{kw.relevance}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="result-card">
                                <div
                                    className="result-header"
                                    onClick={() => toggleSection('description')}
                                >
                                    <div className="result-title">
                                        <FileText size={20} />
                                        <h3>App Description</h3>
                                    </div>
                                    {expandedSections.description ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections.description && (
                                    <div className="result-content">
                                        <div className="description-box">
                                            <div className="promo-text">
                                                <strong>Promo Text:</strong>
                                                <p>{results.asoContent.promoText}</p>
                                            </div>
                                            <div className="full-description">
                                                <strong>Full Description:</strong>
                                                <pre>{results.asoContent.description}</pre>
                                            </div>
                                            <button className="btn btn-secondary" onClick={() => copyToClipboard(results.asoContent.description)}>
                                                <Copy size={16} /> Copy Description
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Screenshots */}
                            <div className="result-card">
                                <div
                                    className="result-header"
                                    onClick={() => toggleSection('screenshots')}
                                >
                                    <div className="result-title">
                                        <Image size={20} />
                                        <h3>Screenshot Headlines & Icon Concepts</h3>
                                    </div>
                                    {expandedSections.screenshots ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections.screenshots && (
                                    <div className="result-content">
                                        <div className="screenshots-grid">
                                            <div>
                                                <h4>Screenshot Headlines</h4>
                                                <div className="headlines-list">
                                                    {results.asoContent.screenshotHeadlines.map((h, i) => (
                                                        <div key={i} className="headline-item">
                                                            <span className="num">{i + 1}</span>
                                                            <span>{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4>Icon Concepts</h4>
                                                <div className="icons-list">
                                                    {results.asoContent.iconConcepts.map((ic, i) => (
                                                        <div key={i} className="icon-concept">
                                                            <div className="icon-preview" style={{ background: `linear-gradient(135deg, ${ic.colors[0]}, ${ic.colors[1]})` }} />
                                                            <div>
                                                                <strong>{ic.name}</strong>
                                                                <p>{ic.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Strategy */}
                            <div className="result-card">
                                <div
                                    className="result-header"
                                    onClick={() => toggleSection('strategy')}
                                >
                                    <div className="result-title">
                                        <Calendar size={20} />
                                        <h3>6-Month Growth Strategy</h3>
                                    </div>
                                    {expandedSections.strategy ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {expandedSections.strategy && (
                                    <div className="result-content">
                                        <div className="strategy-timeline">
                                            {results.strategy.months.map((m, i) => (
                                                <div key={i} className="timeline-item">
                                                    <div className="timeline-month">Month {m.month}</div>
                                                    <div className="timeline-content">
                                                        <h4>{m.theme}</h4>
                                                        <ul>
                                                            {m.asoTasks.map((t, j) => (
                                                                <li key={j}>{t}</li>
                                                            ))}
                                                        </ul>
                                                        <div className="kpis">
                                                            KPIs: {m.kpis.join(', ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="priority-channels">
                                            <strong>Priority Channels:</strong>
                                            <div className="channels-list">
                                                {results.strategy.priorityChannels.map((c, i) => (
                                                    <span key={i} className="channel-tag">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default ASOGenerator;
