import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { apiUrl } from '../services/api';
import '../styles/competitors.css'; // Reusing competitor styles for search results

function ConnectAppModal({ onClose }) {
    const { setCurrentApp, fetchAppDetails } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setError('');
        setSearchResults([]);

        try {
            // Search both stores? For now defaulting to iOS or auto-detect based on term?
            // Let's search App Store by default for this MVP
            const res = await fetch(apiUrl(`/appstore/search?term=${encodeURIComponent(searchTerm)}&num=5`));
            if (!res.ok) throw new Error('Search failed');

            const data = await res.json();
            const formattedResults = data.map(app => ({
                id: app.appId,
                title: app.title,
                developer: app.developer,
                icon: app.icon,
                rating: app.score || 0,
                reviews: app.reviews || 0,
                // store: 'ios' 
            }));

            setSearchResults(formattedResults);
            if (formattedResults.length === 0) setError('No apps found');
        } catch (err) {
            console.error(err);
            setError('Failed to search apps. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectApp = async (app) => {
        // Set basic info first
        const newApp = {
            id: app.id,
            name: app.title,
            bundleId: app.id,
            developer: app.developer,
            icon: app.icon, // Use high res if available
            store: 'ios', // Defaulting to iOS for search
            description: '',
            reviews: [],
            keywords: []
        };

        setCurrentApp(newApp);

        // Trigger detailed fetch
        fetchAppDetails(app.id);

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                <div className="modal-header">
                    <h3>Connect Your App</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>
                        Search for your app on the App Store to sync real-time data.
                    </p>

                    <form onSubmit={handleSearch} className="search-input-group">
                        <div className="search-input-wrapper">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="App Name or ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSearching}>
                            {isSearching ? <Loader2 className="spin" size={20} /> : 'Search'}
                        </button>
                    </form>

                    {error && <div style={{ color: '#ef4444', marginTop: 10 }}>{error}</div>}

                    <div className="search-results">
                        {searchResults.map(app => (
                            <div key={app.id} className="search-result-item" onClick={() => handleSelectApp(app)}>
                                <img src={app.icon} alt="" className="search-result-icon" />
                                <div className="search-result-info">
                                    <div className="search-result-name">{app.title}</div>
                                    <div className="search-result-dev">{app.developer}</div>
                                </div>
                                <button className="btn btn-sm btn-ghost">Connect</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConnectAppModal;
