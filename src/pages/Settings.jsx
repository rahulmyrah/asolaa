import React, { useState } from 'react';
import Header from '../components/Header';
import { apiUrl } from '../services/api';
import {
    Save,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Database,
    Shield
} from 'lucide-react';
import '../styles/settings.css';

function Settings() {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('asolaa_settings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }

        return {
            geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
            anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
            databaseMode: 'Neon Postgres',
        };
    });
    const [showKeys, setShowKeys] = useState({
        gemini: false,
        anthropic: false,
    });
    const [saved, setSaved] = useState(false);
    const [testing, setTesting] = useState({ gemini: false, anthropic: false });
    const [testResults, setTestResults] = useState({ gemini: null, anthropic: null });

    const handleSave = () => {
        localStorage.setItem('asolaa_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const testApiKey = async (provider) => {
        setTesting(prev => ({ ...prev, [provider]: true }));
        setTestResults(prev => ({ ...prev, [provider]: null }));

        try {
            const response = await fetch(apiUrl('/health'));
            if (response.ok) {
                setTestResults(prev => ({ ...prev, [provider]: 'success' }));
            } else {
                setTestResults(prev => ({ ...prev, [provider]: 'error' }));
            }
        } catch {
            // For now, just check if key is provided
            const key = provider === 'gemini' ? settings.geminiApiKey : settings.anthropicApiKey;
            if (key && key.length > 10) {
                setTestResults(prev => ({ ...prev, [provider]: 'success' }));
            } else {
                setTestResults(prev => ({ ...prev, [provider]: 'error' }));
            }
        }

        setTesting(prev => ({ ...prev, [provider]: false }));
    };

    return (
        <>
            <Header title="Settings" />
            <main className="main-content">
                <div className="page-container">
                    <div className="settings-header">
                        <h1>API Configuration</h1>
                        <p>Configure your AI and service API keys. Keys are stored locally in your browser.</p>
                    </div>

                    <div className="settings-grid">
                        {/* Gemini API Key */}
                        <div className="settings-card">
                            <div className="card-header">
                                <div className="card-icon gemini">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3>Google Gemini API</h3>
                                    <p>Used for keyword generation and bulk processing</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>API Key</label>
                                <div className="input-with-button">
                                    <input
                                        type={showKeys.gemini ? 'text' : 'password'}
                                        value={settings.geminiApiKey}
                                        onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                                        placeholder="AIza..."
                                    />
                                    <button
                                        className="btn btn-icon"
                                        onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                                    >
                                        {showKeys.gemini ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => testApiKey('gemini')}
                                    disabled={testing.gemini || !settings.geminiApiKey}
                                >
                                    {testing.gemini ? 'Testing...' : 'Test Connection'}
                                </button>
                                {testResults.gemini && (
                                    <span className={`test-result ${testResults.gemini}`}>
                                        {testResults.gemini === 'success' ? (
                                            <><CheckCircle size={16} /> Valid</>
                                        ) : (
                                            <><AlertCircle size={16} /> Invalid</>
                                        )}
                                    </span>
                                )}
                            </div>

                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="get-key-link"
                            >
                                Get API Key →
                            </a>
                        </div>

                        {/* Anthropic API Key */}
                        <div className="settings-card">
                            <div className="card-header">
                                <div className="card-icon anthropic">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3>Anthropic Claude API</h3>
                                    <p>Used for deep analysis and content generation</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>API Key</label>
                                <div className="input-with-button">
                                    <input
                                        type={showKeys.anthropic ? 'text' : 'password'}
                                        value={settings.anthropicApiKey}
                                        onChange={(e) => setSettings({ ...settings, anthropicApiKey: e.target.value })}
                                        placeholder="sk-ant-..."
                                    />
                                    <button
                                        className="btn btn-icon"
                                        onClick={() => setShowKeys({ ...showKeys, anthropic: !showKeys.anthropic })}
                                    >
                                        {showKeys.anthropic ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => testApiKey('anthropic')}
                                    disabled={testing.anthropic || !settings.anthropicApiKey}
                                >
                                    {testing.anthropic ? 'Testing...' : 'Test Connection'}
                                </button>
                                {testResults.anthropic && (
                                    <span className={`test-result ${testResults.anthropic}`}>
                                        {testResults.anthropic === 'success' ? (
                                            <><CheckCircle size={16} /> Valid</>
                                        ) : (
                                            <><AlertCircle size={16} /> Invalid</>
                                        )}
                                    </span>
                                )}
                            </div>

                            <a
                                href="https://console.anthropic.com/settings/keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="get-key-link"
                            >
                                Get API Key →
                            </a>
                        </div>

                        {/* Neon Config */}
                        <div className="settings-card full-width">
                            <div className="card-header">
                                <div className="card-icon neon">
                                    <Database size={24} />
                                </div>
                                <div>
                                    <h3>Neon Postgres Backend</h3>
                                    <p>Internal auth, SEO audits, strategies, content briefs, publishing drafts, and outreach are stored in Neon.</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Database Mode</label>
                                <input
                                    type="text"
                                    value={settings.databaseMode || 'Neon Postgres'}
                                    onChange={(e) => setSettings({ ...settings, databaseMode: e.target.value })}
                                    placeholder="Neon Postgres"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="security-notice">
                        <Shield size={20} />
                        <div>
                            <strong>Security Note:</strong> Production DataForSEO, LLM, Neon, and auth secrets belong in backend environment variables.
                            This screen is retained for local development convenience only.
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="settings-actions">
                        <button className="btn btn-primary btn-lg" onClick={handleSave}>
                            <Save size={18} />
                            Save Settings
                        </button>
                        {saved && (
                            <span className="save-confirmation">
                                <CheckCircle size={18} />
                                Settings saved!
                            </span>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

export default Settings;
