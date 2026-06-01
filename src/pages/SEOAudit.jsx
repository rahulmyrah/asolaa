import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    ClipboardList,
    ExternalLink,
    FileText,
    Globe2,
    Link2,
    Loader2,
    Megaphone,
    Search,
    Send,
    Sparkles,
    Target,
} from 'lucide-react';
import { apiUrl } from '../services/api';
import '../styles/seo-geo.css';

const defaultForm = {
    url: '',
    niche: '',
    country: 'us',
    language: 'en',
    targetAudience: '',
};

const auditPresets = [
    {
        label: 'Applaa Education',
        values: {
            url: 'https://applaa.com',
            niche: 'AI app builder for kids UK curriculum UKMT 11 plus GCSE exam prep',
            country: 'gb',
            language: 'en',
            targetAudience: 'Children aged 3-18, parents, UK schools, homeschool families, and exam-prep learners',
        },
    },
    {
        label: 'Sanathan',
        values: {
            url: 'https://sanathan.app',
            niche: 'Sanatan dharma learning app spiritual education',
            country: 'in',
            language: 'en',
            targetAudience: 'Families, Hindu diaspora, temples, and spiritual learners',
        },
    },
];

function ScoreRing({ label, value }) {
    return (
        <div className="score-ring">
            <div className="score-ring-value">{value}</div>
            <div className="score-ring-label">{label}</div>
        </div>
    );
}

function StatusPill({ children, tone = 'neutral' }) {
    return <span className={`seo-pill ${tone}`}>{children}</span>;
}

function SEOAudit() {
    const [formData, setFormData] = useState(defaultForm);
    const [audit, setAudit] = useState(null);
    const [strategy, setStrategy] = useState(null);
    const [brief, setBrief] = useState(null);
    const [queueResult, setQueueResult] = useState(null);
    const [outreachResult, setOutreachResult] = useState(null);
    const [activeKeyword, setActiveKeyword] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    const topKeywords = useMemo(() => audit?.keywords?.slice(0, 12) || [], [audit]);
    const topCompetitors = useMemo(() => audit?.competitors?.slice(0, 6) || [], [audit]);

    const updateForm = (field, value) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const applyPreset = (preset) => {
        setFormData(preset.values);
        setAudit(null);
        setStrategy(null);
        setBrief(null);
        setQueueResult(null);
        setOutreachResult(null);
        setError('');
    };

    const runRequest = async (label, fn) => {
        setLoading(label);
        setError('');
        try {
            await fn();
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading('');
        }
    };

    const runAudit = async (event) => {
        event.preventDefault();
        setAudit(null);
        setStrategy(null);
        setBrief(null);
        setQueueResult(null);
        setOutreachResult(null);

        await runRequest('audit', async () => {
            const response = await fetch(apiUrl('/seo/audit'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Audit failed.');
            setAudit(result.data);
            setActiveKeyword(result.data.keywords?.[0]?.keyword || '');
        });
    };

    const generateStrategy = async () => {
        if (!audit) return;
        await runRequest('strategy', async () => {
            const response = await fetch(apiUrl('/seo/strategy'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auditId: audit.id,
                    seedKeywords: topKeywords.map((item) => item.keyword),
                    competitors: topCompetitors,
                    goal: 'Grow qualified organic traffic and AI search visibility',
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Strategy generation failed.');
            setStrategy(result.data);
        });
    };

    const generateBrief = async (keywordOverride) => {
        const keyword = keywordOverride || activeKeyword;
        if (!keyword) return;
        await runRequest('brief', async () => {
            const response = await fetch(apiUrl('/seo/content/brief'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auditId: audit?.id,
                    keyword,
                    funnelStage: 'MOFU',
                    targetUrl: audit?.url,
                    competitors: topCompetitors,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Brief generation failed.');
            setBrief(result.data);
        });
    };

    const queueSocialDrafts = async () => {
        const items = strategy?.socialCalendar || brief?.socialSnippets?.map((post, index) => ({
            platform: ['linkedin', 'x', 'facebook'][index % 3],
            post,
        })) || [];
        if (!items.length) return;

        await runRequest('queue', async () => {
            const response = await fetch(apiUrl('/publishing/queue'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignName: `${audit?.domain || 'SEO'} campaign`, items }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Queue failed.');
            setQueueResult(result.data);
        });
    };

    const prepareOutreach = async () => {
        if (!topCompetitors.length) return;
        await runRequest('outreach', async () => {
            const response = await fetch(apiUrl('/backlinks/outreach'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignName: `${audit?.domain || 'SEO'} backlink outreach`,
                    offer: 'an expert quote, data-backed guide, or practical SEO resource',
                    prospects: topCompetitors,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || 'Outreach generation failed.');
            setOutreachResult(result.data);
        });
    };

    return (
        <>
            <Header title="SEO / GEO Strategy" />
            <main className="main-content">
                <div className="page-container seo-page">
                    <section className="seo-workbench">
                        <div className="seo-intro">
                            <div className="seo-icon">
                                <Globe2 size={28} />
                            </div>
                            <div>
                                <h1>SEO/GEO Audit Engine</h1>
                                <p>Analyze any website, discover long-tail keywords, build content strategy, and prepare safe publishing/backlink workflows.</p>
                            </div>
                        </div>

                        <div className="seo-preset-row">
                            {auditPresets.map((preset) => (
                                <button key={preset.label} type="button" className="btn btn-secondary" onClick={() => applyPreset(preset)}>
                                    <Target size={16} />
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        <form className="seo-audit-form" onSubmit={runAudit}>
                            <label>
                                Website URL
                                <input
                                    value={formData.url}
                                    onChange={(event) => updateForm('url', event.target.value)}
                                    placeholder="https://example.com"
                                    required
                                />
                            </label>
                            <label>
                                Niche / Seed Topic
                                <input
                                    value={formData.niche}
                                    onChange={(event) => updateForm('niche', event.target.value)}
                                    placeholder="AI education app for kids or daily panchang app"
                                />
                            </label>
                            <label>
                                Target Audience
                                <input
                                    value={formData.targetAudience}
                                    onChange={(event) => updateForm('targetAudience', event.target.value)}
                                    placeholder="Founders, marketers, local businesses"
                                />
                            </label>
                            <label>
                                Country
                                <select value={formData.country} onChange={(event) => updateForm('country', event.target.value)}>
                                    <option value="us">United States</option>
                                    <option value="gb">United Kingdom</option>
                                    <option value="ca">Canada</option>
                                    <option value="au">Australia</option>
                                    <option value="in">India</option>
                                </select>
                            </label>
                            <button className="btn btn-primary" type="submit" disabled={Boolean(loading)}>
                                {loading === 'audit' ? <Loader2 className="spin" size={18} /> : <Search size={18} />}
                                Run SEO Audit
                            </button>
                        </form>

                        {error && (
                            <div className="seo-alert">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}
                    </section>

                    {audit && (
                        <>
                            <section className="seo-score-grid">
                                <div className="seo-summary-panel">
                                    <div>
                                        <StatusPill tone={audit.page.fetched ? 'success' : 'warning'}>
                                            {audit.page.fetched ? 'Page fetched' : 'Limited crawl'}
                                        </StatusPill>
                                        <StatusPill tone={audit.dataSources.dataForSeo.configured ? 'success' : 'warning'}>
                                            DataForSEO {audit.dataSources.dataForSeo.configured ? 'connected' : 'not configured'}
                                        </StatusPill>
                                    </div>
                                    <h2>{audit.title || audit.domain}</h2>
                                    <p>{audit.description || 'No meta description found. Add a concise answer-first description for better SERP and AI answer visibility.'}</p>
                                    <a href={audit.url} target="_blank" rel="noreferrer">
                                        Visit audited page <ExternalLink size={14} />
                                    </a>
                                </div>
                                <ScoreRing label={`Overall ${audit.grade}`} value={audit.scores.overall} />
                                <ScoreRing label="Technical" value={audit.scores.technical} />
                                <ScoreRing label="Content" value={audit.scores.contentQuality} />
                                <ScoreRing label="Schema" value={audit.scores.schema} />
                                <ScoreRing label="AI/GEO" value={audit.scores.aiReadiness} />
                            </section>

                            <section className="seo-grid-two">
                                <div className="seo-panel">
                                    <div className="seo-panel-header">
                                        <Target size={18} />
                                        <h3>Prioritized Fixes</h3>
                                    </div>
                                    <div className="seo-fix-list">
                                        {audit.fixes.map((fix) => (
                                            <div key={fix.title} className="seo-fix-row">
                                                <StatusPill tone={fix.priority === 'critical' ? 'danger' : 'neutral'}>{fix.priority}</StatusPill>
                                                <div>
                                                    <strong>{fix.title}</strong>
                                                    <span>{fix.impact}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="seo-panel">
                                    <div className="seo-panel-header">
                                        <Link2 size={18} />
                                        <h3>Backlink Profile</h3>
                                    </div>
                                    <div className="seo-metric-list">
                                        <span>Backlinks <strong>{audit.backlinkProfile.backlinks || 0}</strong></span>
                                        <span>Referring domains <strong>{audit.backlinkProfile.referring_domains || 0}</strong></span>
                                        <span>Referring pages <strong>{audit.backlinkProfile.referring_pages || 0}</strong></span>
                                        <span>Broken backlinks <strong>{audit.backlinkProfile.broken_backlinks || 0}</strong></span>
                                    </div>
                                    <button className="btn btn-secondary" onClick={prepareOutreach} disabled={Boolean(loading)}>
                                        {loading === 'outreach' ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
                                        Prepare Outreach Drafts
                                    </button>
                                </div>
                            </section>

                            {audit.productProfile && (
                                <section className="seo-grid-two">
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <Sparkles size={18} />
                                            <h3>{audit.productProfile.name} Positioning</h3>
                                        </div>
                                        <p className="seo-muted">{audit.productProfile.positioning}</p>
                                        <div className="seo-draft-list">
                                            {audit.productProfile.differentiators?.slice(0, 6).map((item) => (
                                                <div key={item}>
                                                    <strong>{item}</strong>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <Link2 size={18} />
                                            <h3>Education Competitors</h3>
                                        </div>
                                        <div className="seo-chip-list">
                                            {audit.productProfile.competitorDomains?.slice(0, 18).map((domain) => (
                                                <span key={domain}>{domain}</span>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section className="seo-panel">
                                <div className="seo-panel-header">
                                    <BarChart3 size={18} />
                                    <h3>Long-Tail Keywords</h3>
                                            <button className="btn btn-secondary" onClick={generateStrategy} disabled={Boolean(loading)}>
                                                {loading === 'strategy' ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
                                                Generate Strategy
                                            </button>
                                </div>
                                <div className="seo-table-wrap">
                                    <table className="seo-table">
                                        <thead>
                                            <tr>
                                                <th>Keyword</th>
                                                <th>Intent</th>
                                                <th>Volume</th>
                                                <th>CPC</th>
                                                <th>Difficulty</th>
                                                <th>Brief</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topKeywords.map((item) => (
                                                <tr key={item.keyword}>
                                                    <td>{item.keyword}</td>
                                                    <td>{item.intent}</td>
                                                    <td>{item.searchVolume?.toLocaleString?.() || 0}</td>
                                                    <td>${item.cpc || 0}</td>
                                                    <td>{item.difficulty ?? 'N/A'}</td>
                                                    <td>
                                                        <button
                                                            className="seo-icon-btn"
                                                            onClick={() => {
                                                                setActiveKeyword(item.keyword);
                                                                generateBrief(item.keyword);
                                                            }}
                                                            title="Generate content brief"
                                                        >
                                                            <FileText size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {strategy && (
                                <section className="seo-grid-two">
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <ClipboardList size={18} />
                                            <h3>30 / 60 / 90 Roadmap</h3>
                                        </div>
                                        <div className="seo-roadmap">
                                            {strategy.roadmap?.map((phase) => (
                                                <div key={phase.window}>
                                                    <strong>{phase.window}</strong>
                                                    <ul>
                                                        {phase.actions?.map((action) => <li key={action}>{action}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <Target size={18} />
                                            <h3>Keyword Clusters</h3>
                                        </div>
                                        <div className="seo-cluster-list">
                                            {strategy.keywordClusters?.map((cluster, index) => (
                                                <div key={`${cluster.stage}-${index}`}>
                                                    <StatusPill tone={cluster.stage === 'BOFU' ? 'success' : 'neutral'}>{cluster.stage}</StatusPill>
                                                    <strong>{cluster.theme}</strong>
                                                    <span>{cluster.contentType}</span>
                                                    <p>{cluster.keywords?.join(', ')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {strategy && (
                                <section className="seo-grid-two">
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <FileText size={18} />
                                            <h3>Content Roadmap</h3>
                                        </div>
                                        <div className="seo-draft-list">
                                            {strategy.contentRoadmap?.slice(0, 6).map((item, index) => (
                                                <div key={`${item.keyword}-${index}`}>
                                                    <StatusPill>{item.intent || 'content'}</StatusPill>
                                                    <strong>{item.title}</strong>
                                                    <p>{item.keyword} - {item.format}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="seo-panel">
                                        <div className="seo-panel-header">
                                            <Megaphone size={18} />
                                            <h3>Social Drafts</h3>
                                            <button className="btn btn-secondary" onClick={queueSocialDrafts} disabled={Boolean(loading)}>
                                                Queue Drafts
                                            </button>
                                        </div>
                                        <div className="seo-draft-list">
                                            {strategy.socialCalendar?.slice(0, 5).map((item, index) => (
                                                <div key={`${item.channel}-${index}`}>
                                                    <StatusPill>{item.channel}</StatusPill>
                                                    <p>{item.post}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {brief && (
                                <section className="seo-panel">
                                    <div className="seo-panel-header">
                                        <FileText size={18} />
                                        <h3>Content Brief: {brief.keyword}</h3>
                                    </div>
                                    <div className="seo-brief-grid">
                                        <div>
                                            <h4>Title Options</h4>
                                            {brief.titleOptions?.map((title) => <p key={title}>{title}</p>)}
                                        </div>
                                        <div>
                                            <h4>Outline</h4>
                                            <ol>
                                                {brief.outline?.map((item) => <li key={item}>{item}</li>)}
                                            </ol>
                                        </div>
                                        <div>
                                            <h4>FAQ</h4>
                                            {brief.faq?.map((item) => (
                                                <p key={item.question}><strong>{item.question}</strong> {item.answer}</p>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {(queueResult || outreachResult) && (
                                <section className="seo-grid-two">
                                    {queueResult && (
                                        <div className="seo-panel">
                                            <div className="seo-panel-header">
                                                <CheckCircle size={18} />
                                                <h3>Publishing Queue</h3>
                                            </div>
                                            {queueResult.slice(0, 4).map((item) => (
                                                <p key={item.id}>{item.platform}: {item.status}</p>
                                            ))}
                                        </div>
                                    )}
                                    {outreachResult && (
                                        <div className="seo-panel">
                                            <div className="seo-panel-header">
                                                <CheckCircle size={18} />
                                                <h3>Outreach Drafts</h3>
                                            </div>
                                            {outreachResult.slice(0, 4).map((item) => (
                                                <p key={item.id}>{item.prospect}: {item.status}</p>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default SEOAudit;
