import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import {
    Plus,
    Search,
    Trash2,
    TrendingUp,
    Users,
    Star,
    Download,
    ExternalLink,
    X,
    Loader2,
    Globe
} from 'lucide-react';
import '../styles/competitors.css';

function Competitors() {
    // Mock store for now - in real app would use persistent store
    // const { competitors, addCompetitor, removeCompetitor } = useAppStore();
    const [competitors, setCompetitors] = useState([
        {
            id: 'com.example.competitor1',
            title: 'Fitness Coach - Workouts',
            developer: 'FitLife Inc.',
            icon: 'https://ui-avatars.com/api/?name=FC&background=0D8ABC&color=fff&size=128',
            rating: 4.8,
            reviews: 12500,
            rank: 12,
            downloads: '50k+',
            lastUpdated: '2 days ago'
        },
        {
            id: 'com.example.competitor2',
            title: 'Gym Master Pro',
            developer: 'Muscle Apps',
            icon: 'https://ui-avatars.com/api/?name=GM&background=E17055&color=fff&size=128',
            rating: 4.5,
            reviews: 8200,
            rank: 15,
            downloads: '25k+',
            lastUpdated: '1 week ago'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setSearchResults([]); // Clear previous results

        try {
            const res = await fetch(`http://localhost:3001/api/appstore/search?term=${encodeURIComponent(searchTerm)}&num=5`);
            if (!res.ok) throw new Error('Search failed');

            const data = await res.json();
            // Transform API data to match our UI needs
            const formattedResults = data.map(app => ({
                id: app.appId,
                title: app.title,
                developer: app.developer,
                icon: app.icon,
                rating: app.score || 0,
                reviews: app.reviews || 0,
                url: app.url
            }));

            setSearchResults(formattedResults);
        } catch (err) {
            console.error(err);
            // Fallback for demo if API fails
            setSearchResults([
                {
                    id: 'com.test.app1',
                    title: `${searchTerm} (Demo)`,
                    developer: 'Demo Dev',
                    icon: `https://ui-avatars.com/api/?name=${searchTerm.substring(0, 2)}&background=random`,
                    rating: 4.2,
                    reviews: 1000
                }
            ]);
        } finally {
            setIsSearching(false);
        }
    };

    const addCompetitor = (app) => {
        if (!competitors.find(c => c.id === app.id)) {
            setCompetitors([...competitors, {
                ...app,
                rank: Math.floor(Math.random() * 50) + 1, // Mock data enrichment
                downloads: '10k+',
                lastUpdated: 'Unknown'
            }]);
        }
        setShowAddModal(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeCompetitor = (id) => {
        setCompetitors(competitors.filter(c => c.id !== id));
    };

    return (
        <>
            <Header title="Competitor Spy" />
            <main className="main-content">
                <div className="page-container">

                    {/* Header Actions */}
                    <div className="page-header" style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Competitor Analysis</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Track and compare performance against top competitors.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={20} />
                            Add Competitor
                        </button>
                    </div>

                    {/* Competitors Grid */}
                    <div className="competitors-grid">
                        {competitors.map(app => (
                            <div key={app.id} className="competitor-card">
                                <button className="competitor-actions action-btn delete" onClick={() => removeCompetitor(app.id)}>
                                    <Trash2 size={16} />
                                </button>
                                <div className="competitor-header">
                                    <img src={app.icon} alt={app.title} className="competitor-icon" />
                                    <div className="competitor-info">
                                        <h3>{app.title}</h3>
                                        <div className="competitor-developer">{app.developer}</div>
                                    </div>
                                </div>
                                <div className="competitor-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Category Rank</span>
                                        <div className="stat-value">
                                            #{app.rank}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Rating</span>
                                        <div className="stat-value">
                                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                            {app.rating}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Reviews</span>
                                        <div className="stat-value">
                                            {app.reviews.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Downloads</span>
                                        <div className="stat-value">
                                            {app.downloads}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Widget */}
                    {competitors.length > 0 && (
                        <div className="comparison-section">
                            <div className="section-header">
                                <h2>Direct Comparison</h2>
                                <button className="btn btn-ghost">Export Report</button>
                            </div>
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>App</th>
                                        <th>Rank</th>
                                        <th>Rating</th>
                                        <th>Reviews</th>
                                        <th>Visibility Score</th>
                                        <th>Updates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitors.map(app => (
                                        <tr key={app.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <img src={app.icon} style={{ width: 32, height: 32, borderRadius: 8 }} alt="" />
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
                                                    <div style={{ width: `${Math.random() * 60 + 40}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: 3 }}></div>
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{app.lastUpdated}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Add Competitor Modal */}
                    {showAddModal && (
                        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                                <div className="modal-header">
                                    <h3>Add Competitor</h3>
                                    <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSearch} className="search-input-group">
                                        <div className="search-input-wrapper">
                                            <Search size={20} />
                                            <input
                                                type="text"
                                                placeholder="Search by app name or package ID..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={isSearching}>
                                            {isSearching ? <Loader2 className="spin" /> : 'Search'}
                                        </button>
                                    </form>

                                    <div className="search-results">
                                        {searchResults.map(app => (
                                            <div key={app.id} className="search-result-item" onClick={() => addCompetitor(app)}>
                                                <img src={app.icon} alt="" className="search-result-icon" />
                                                <div className="search-result-info">
                                                    <div className="search-result-name">{app.title}</div>
                                                    <div className="search-result-dev">{app.developer}</div>
                                                </div>
                                                <Plus size={20} style={{ color: 'var(--primary-color)' }} />
                                            </div>
                                        ))}
                                        {searchResults.length === 0 && !isSearching && searchTerm && (
                                            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                                                No apps found. Try a different name.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </>
    );
}

export default Competitors;
