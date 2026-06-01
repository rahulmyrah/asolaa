import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import {
    ExternalLink,
    Info,
    TrendingUp,
    TrendingDown,
    Star,
    DollarSign,
    Download,
    Hash,
    BarChart2,
} from 'lucide-react';
import '../styles/app-overview.css';

function AppOverview() {
    const { currentApp, keywords, updateApp } = useAppStore();
    const [activeTab, setActiveTab] = useState('metadata');
    const [tempValues, setTempValues] = useState({
        title: currentApp?.title || '',
        subtitle: currentApp?.subtitle || '',
        description: currentApp?.description || '',
    });

    const tabs = [
        { id: 'metadata', label: 'Metadata' },
        { id: 'creatives', label: 'Creatives' },
        { id: 'roadmap', label: 'Roadmap' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'project-details', label: 'Project Details' },
    ];

    const handleSave = (field) => {
        updateApp(currentApp.id, { [field]: tempValues[field] });
    };

    const getCharacterCount = (field) => {
        const maxLengths = { title: 30, subtitle: 30, description: 4000 };
        const current = tempValues[field]?.length || 0;
        return `${current} / ${maxLengths[field]} characters`;
    };

    return (
        <>
            <Header title="App Overview" />
            <main className="main-content">
                <div className="page-container">
                    {/* App Header Section */}
                    <div className="app-header-section">
                        <div className="app-tabs-row">
                            <button className="app-tab active">My app</button>
                            <button className="app-tab">Competitor's app</button>
                        </div>

                        <div className="app-info-row">
                            <div className="app-icon-container">
                                {currentApp?.icon ? (
                                    <img src={currentApp.icon} alt={currentApp.name} />
                                ) : (
                                    <div className="app-icon-placeholder">
                                        {currentApp?.name?.charAt(0) || 'A'}
                                    </div>
                                )}
                            </div>
                            <div className="app-details">
                                <h2 className="app-name">{currentApp?.name}</h2>
                                <p className="app-developer">{currentApp?.developer}</p>
                            </div>
                            <div className="app-badges">
                                <span className="badge badge-category">{currentApp?.category}</span>
                                <span className="badge badge-price">
                                    <DollarSign size={12} />
                                    {currentApp?.price}
                                </span>
                                {currentApp?.hasInAppPurchases && (
                                    <span className="badge badge-iap">In-App Purchases</span>
                                )}
                                <span className="aso-score">
                                    SEO/GEO Score: <strong>{currentApp?.asoScore}</strong>
                                </span>
                                <a href={currentApp?.website} className="view-store-link" target="_blank" rel="noreferrer">
                                    <ExternalLink size={14} />
                                    Open Website
                                </a>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="stats-row">
                            <div className="stat-card">
                                <div className="stat-label">
                                    <Download size={14} />
                                    Launch Status
                                </div>
                                <div className="stat-value">{currentApp?.downloads}</div>
                                <div className="stat-subtitle">Current internal sprint</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">
                                    <DollarSign size={14} />
                                    Monetization
                                </div>
                                <div className="stat-value">{currentApp?.revenue}</div>
                                <div className="stat-subtitle">Current internal sprint</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">
                                    <Star size={14} />
                                    Current Focus
                                </div>
                                <div className="stat-value empty">{currentApp?.focus}</div>
                            </div>

                            <div className="stat-card highlight">
                                <div className="stat-label">
                                    <Hash size={14} />
                                    Tracked Keywords
                                </div>
                                <div className="stat-value">
                                    {currentApp?.totalKeywords}
                                    <span className={`stat-change ${currentApp?.keywordChange >= 0 ? 'positive' : 'negative'}`}>
                                        {currentApp?.keywordChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {currentApp?.keywordChange}
                                    </span>
                                </div>
                                <div className="stat-subtitle">Current SEO sprint</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-label">
                                    <BarChart2 size={14} />
                                    Product Stage
                                </div>
                                <div className="stat-value empty">{currentApp?.categoryRank}</div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Tabs */}
                    <div className="metadata-section">
                        <div className="tabs-container">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'metadata' && (
                            <div className="metadata-content">
                                <div className="metadata-editor">
                                    {/* Title */}
                                    <div className="field-group">
                                        <div className="field-header">
                                            <label className="field-label">
                                                Title <Info size={12} />
                                            </label>
                                            <span className="field-link">Use Keyword Research for next content clusters</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={tempValues.title}
                                            onChange={(e) => setTempValues({ ...tempValues, title: e.target.value })}
                                            onBlur={() => handleSave('title')}
                                            className="field-input"
                                            maxLength={30}
                                        />
                                        <span className={`char-count ${tempValues.title?.length >= 30 ? 'limit' : ''}`}>
                                            {getCharacterCount('title')}
                                        </span>
                                    </div>

                                    {/* Subtitle */}
                                    <div className="field-group">
                                        <div className="field-header">
                                            <label className="field-label">
                                                Subtitle <Info size={12} />
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={tempValues.subtitle}
                                            onChange={(e) => setTempValues({ ...tempValues, subtitle: e.target.value })}
                                            onBlur={() => handleSave('subtitle')}
                                            className="field-input"
                                            maxLength={30}
                                        />
                                        <span className={`char-count ${tempValues.subtitle?.length >= 30 ? 'limit' : ''}`}>
                                            {getCharacterCount('subtitle')}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="field-group">
                                        <div className="field-header">
                                            <label className="field-label">
                                                Description <Info size={12} />
                                            </label>
                                        </div>
                                        <textarea
                                            value={tempValues.description}
                                            onChange={(e) => setTempValues({ ...tempValues, description: e.target.value })}
                                            onBlur={() => handleSave('description')}
                                            className="field-textarea"
                                            rows={12}
                                            maxLength={4000}
                                        />
                                        <span className={`char-count ${tempValues.description?.length >= 4000 ? 'limit' : ''}`}>
                                            {getCharacterCount('description')}
                                        </span>
                                    </div>
                                </div>

                                {/* Keyword Density Table */}
                                <div className="keyword-density">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Keyword</th>
                                                <th>Count</th>
                                                <th>Density</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {keywords.slice(0, 10).map((kw) => (
                                                <tr key={kw.id}>
                                                    <td className="keyword-name">{kw.keyword}</td>
                                                    <td>{kw.count}</td>
                                                    <td>{kw.density}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'metadata' && (
                            <div className="coming-soon">
                                <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
                                <p>{currentApp?.roadmap?.join(' | ') || 'Project plan is being prepared.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default AppOverview;

