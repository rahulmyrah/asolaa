import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppStore } from '../store/appStore';
import { apiUrl } from '../services/api';
import {
    Plus,
    Search,
    TrendingUp,
    TrendingDown,
    Zap,
    Loader2,
    CheckCircle,
    BarChart3,
    AlertCircle,
    Info
} from 'lucide-react';
import '../styles/keyword-research.css';

function KeywordResearch() {
    const { addKeyword, keywords } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(apiUrl('/ai/keywords/suggest'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-gemini-api-key': localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
                },
                body: JSON.stringify({
                    seed: searchTerm,
                    category: 'All', // Default or fetch from store
                    count: 20
                })
            });

            if (!response.ok) throw new Error('Failed to fetch suggestions');

            const data = await response.json();

            // Enrich data with mock difficulty if not present (AI endpoint should return it)
            const enrichedData = data.suggestions.map(s => ({
                ...s,
                difficulty: s.difficulty || Math.floor(Math.random() * 100), // Fallback if API doesn't return
                volume: s.volume || Math.floor(Math.random() * 10000), // Fallback
                tracked: keywords.some(k => k.keyword === s.keyword)
            }));

            setSuggestions(enrichedData);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch keywords. Make sure API keys are set in Settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleTrackKeyword = (keywordData) => {
        addKeyword({
            keyword: keywordData.keyword,
            rank: null,
            searchVolume: keywordData.volume,
            difficulty: keywordData.difficulty,
            count: 0,
            density: 0,
            change: 0,
        });

        // Update local state to show it's tracked
        setSuggestions(prev => prev.map(s =>
            s.keyword === keywordData.keyword ? { ...s, tracked: true } : s
        ));
    };

    const getDifficultyColor = (score) => {
        if (score < 40) return 'easy';
        if (score < 70) return 'medium';
        return 'hard';
    };

    const getDifficultyLabel = (score) => {
        if (score < 40) return 'Easy';
        if (score < 70) return 'Medium';
        return 'Hard';
    };

    return (
        <>
            <Header title="Keyword Research" />
            <main className="main-content">
                <div className="page-container">

                    {/* Search Section */}
                    <div className="search-container">
                        <h2 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Find SEO/GEO Keywords</h2>
                        <form onSubmit={handleSearch} className="search-input-group">
                            <div className="search-input-wrapper">
                                <Search size={20} />
                                <input
                                    type="text"
                                    placeholder="Try 'AI app builder for kids' or 'daily panchang app'..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <Loader2 className="spin" size={20} /> : <Zap size={20} />}
                                {loading ? 'Analyzing...' : 'Generate Ideas'}
                            </button>
                        </form>
                        {error && (
                            <div style={{ marginTop: 12, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Table */}
                    {suggestions.length > 0 && (
                        <div className="keywords-table-card">
                            <div className="table-header-actions">
                                <div className="table-title">
                                    <h3>Keyword Suggestions</h3>
                                    <p>Found {suggestions.length} keywords related to "{searchTerm}"</p>
                                </div>
                                <button className="btn btn-ghost" onClick={() => setSuggestions([])}>Clear Results</button>
                            </div>

                            <table className="keywords-table">
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Difficulty</th>
                                        <th>Est. Volume</th>
                                        <th>Relevance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suggestions.map((item, index) => (
                                        <tr key={index}>
                                            <td className="keyword-cell">{item.keyword}</td>
                                            <td>
                                                <span className={`difficulty-badge ${getDifficultyColor(item.difficulty)}`}>
                                                    {item.difficulty} • {getDifficultyLabel(item.difficulty)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="metric-cell">{item.volume.toLocaleString()}</div>
                                                <div className="volume-bar-container">
                                                    <div
                                                        className="volume-bar-fill"
                                                        style={{ width: `${Math.min(item.volume / 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <BarChart3 size={14} color="#A78BFA" />
                                                    {item.relevance || 'High'}
                                                </div>
                                            </td>
                                            <td>
                                                {item.tracked ? (
                                                    <button className="btn btn-ghost btn-sm" disabled style={{ color: '#34D399' }}>
                                                        <CheckCircle size={16} />
                                                        Tracked
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="action-btn add"
                                                        onClick={() => handleTrackKeyword(item)}
                                                        title="Track this keyword"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {suggestions.length === 0 && !loading && (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3>Start Applaa or Sanathan Research</h3>
                            <p>Enter a seed keyword to find long-tail terms for content briefs, landing pages, and backlink planning.</p>
                        </div>
                    )}

                </div>
            </main>
        </>
    );
}

export default KeywordResearch;
