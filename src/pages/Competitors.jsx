import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import { competitorSets } from '../data/projects';
import {
    ExternalLink,
    Globe,
    Plus,
    Search,
    Star,
    Trash2,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import '../styles/competitors.css';

const avatarUrl = (name, background = '6C5CE7') =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name.slice(0, 2))}&background=${background}&color=fff&size=128`;

function Competitors() {
    const { currentApp } = useAppStore();
    const projectKey = currentApp?.id === 'sanathan' ? 'sanathan' : 'applaa';
    const [competitors, setCompetitors] = useState(competitorSets[projectKey]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        setCompetitors(competitorSets[projectKey]);
    }, [projectKey]);

    const focusLabel = projectKey === 'sanathan'
        ? 'Hindu spiritual, astrology, Kundli, puja, yoga, and meditation competitors'
        : 'AI education, coding for kids, UK curriculum, and exam-prep competitors';

    const filteredSuggestions = useMemo(() => {
        const pool = competitorSets[projectKey];
        if (!searchTerm.trim()) return pool;
        return pool.filter((competitor) =>
            `${competitor.title} ${competitor.developer}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projectKey, searchTerm]);

    const addCompetitor = (app) => {
        if (!competitors.find((competitor) => competitor.id === app.id)) {
            setCompetitors([...competitors, app]);
        }
        setShowAddModal(false);
        setSearchTerm('');
    };

    const removeCompetitor = (id) => {
        setCompetitors(competitors.filter((competitor) => competitor.id !== id));
    };

    return (
        <>
            <Header title="Competitor Research" />
            <main className="main-content">
                <div className="page-container">
                    <div className="page-header" style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{currentApp.name} Competitor Map</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{focusLabel}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={20} />
                            Add Prospect
                        </button>
                    </div>

                    <div className="competitors-grid">
                        {competitors.map((app, index) => (
                            <div key={app.id} className="competitor-card">
                                <button className="competitor-actions action-btn delete" onClick={() => removeCompetitor(app.id)}>
                                    <Trash2 size={16} />
                                </button>
                                <div className="competitor-header">
                                    <img src={avatarUrl(app.title, index % 2 ? 'E17055' : '0984E3')} alt={app.title} className="competitor-icon" />
                                    <div className="competitor-info">
                                        <h3>{app.title}</h3>
                                        <div className="competitor-developer">{app.developer}</div>
                                    </div>
                                </div>
                                <div className="competitor-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Priority</span>
                                        <div className="stat-value">#{app.rank}</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Rating</span>
                                        <div className="stat-value">
                                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                            {app.rating}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Signals</span>
                                        <div className="stat-value">{app.reviews.toLocaleString()}</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Market</span>
                                        <div className="stat-value">{app.downloads}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="comparison-section">
                        <div className="section-header">
                            <h2>SEO/GEO Comparison</h2>
                            <button className="btn btn-ghost">
                                <ExternalLink size={16} />
                                Export Brief
                            </button>
                        </div>
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Competitor</th>
                                    <th>Priority</th>
                                    <th>Rating</th>
                                    <th>Market Signals</th>
                                    <th>Visibility Score</th>
                                    <th>Backlink Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {competitors.map((app, index) => (
                                    <tr key={app.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src={avatarUrl(app.title, index % 2 ? 'E17055' : '0984E3')} style={{ width: 32, height: 32, borderRadius: 8 }} alt="" />
                                            <span style={{ fontWeight: 500 }}>{app.title}</span>
                                        </td>
                                        <td>#{app.rank}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {app.rating} <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                            </div>
                                        </td>
                                        <td>{app.reviews.toLocaleString()}</td>
                                        <td>
                                            <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                                <div style={{ width: `${app.visibility}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: 3 }} />
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Find link gaps</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showAddModal && (
                        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                            <div className="modal" onClick={(event) => event.stopPropagation()} style={{ maxWidth: 600 }}>
                                <div className="modal-header">
                                    <h3>Add Competitor Prospect</h3>
                                    <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="search-input-group">
                                        <div className="search-input-wrapper">
                                            <Search size={20} />
                                            <input
                                                type="text"
                                                placeholder="Search the curated competitor set..."
                                                value={searchTerm}
                                                onChange={(event) => setSearchTerm(event.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="search-results">
                                        {filteredSuggestions.map((app) => (
                                            <div key={app.id} className="search-result-item" onClick={() => addCompetitor(app)}>
                                                <img src={avatarUrl(app.title)} alt="" className="search-result-icon" />
                                                <div className="search-result-info">
                                                    <div className="search-result-name">{app.title}</div>
                                                    <div className="search-result-dev">{app.developer}</div>
                                                </div>
                                                <Globe size={20} style={{ color: 'var(--primary-color)' }} />
                                            </div>
                                        ))}
                                        {filteredSuggestions.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                                                No curated prospect found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="comparison-section">
                        <div className="section-header">
                            <h2>Next Link-Building Actions</h2>
                            <TrendingUp size={20} color="var(--primary-color)" />
                        </div>
                        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                            {[
                                'Run backlink gap reports for the top 5 competitors.',
                                'Score prospects by topical relevance and authority.',
                                'Create outreach drafts for education/spiritual blogs.',
                                'Queue only approved outreach. No blind submissions.',
                            ].map((item) => (
                                <div key={item} className="stat-card" style={{ minHeight: 110 }}>
                                    <Users size={20} color="var(--primary-color)" />
                                    <p style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Competitors;
