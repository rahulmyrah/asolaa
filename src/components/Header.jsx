import React from 'react';
import { useAppStore } from '../store/appStore';
import { Bell, HelpCircle, ChevronDown, Menu, CheckCircle } from 'lucide-react';

function Header({ title }) {
    const { currentApp, apps, setCurrentApp, toggleSidebar } = useAppStore();

    return (
        <>
            <div className="trial-banner">
                Internal SEO/GEO workspace for Applaa and Sanathan MVP planning.
            </div>

            <header className="header">
                <div className="header-left">
                    <button className="header-icon-btn mobile-menu-btn" onClick={toggleSidebar}>
                        <Menu />
                    </button>
                    <h1 className="header-title">{title}</h1>
                </div>

                <div className="header-right">
                    <div className="header-app-select" style={{ position: 'relative' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            onClick={() => document.getElementById('app-dropdown').classList.toggle('show')}
                        >
                            {currentApp?.icon ? (
                                <img src={currentApp.icon} alt={currentApp.name} />
                            ) : (
                                <div style={{
                                    width: 24,
                                    height: 24,
                                    background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}>
                                    {currentApp?.name?.charAt(0) || 'A'}
                                </div>
                            )}
                            <span style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentApp?.name || 'Select App'}
                            </span>
                            <ChevronDown size={16} />
                        </div>

                        {/* Dropdown Menu */}
                        <div id="app-dropdown" className="app-dropdown-menu">
                            {apps.map(app => (
                                <div
                                    key={app.id}
                                    className={`app-dropdown-item ${currentApp?.id === app.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setCurrentApp(app);
                                        document.getElementById('app-dropdown').classList.remove('show');
                                    }}
                                >
                                    {app.icon ? (
                                        <img src={app.icon} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
                                    ) : (
                                        <div style={{ width: 20, height: 20, background: '#eee', borderRadius: 4 }}></div>
                                    )}
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.name}</span>
                                    {currentApp?.id === app.id && <CheckCircle size={14} color="var(--primary-color)" style={{ marginLeft: 'auto' }} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="header-icons">
                        <button className="header-icon-btn">
                            <Bell size={20} />
                        </button>
                        <button className="header-icon-btn">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
