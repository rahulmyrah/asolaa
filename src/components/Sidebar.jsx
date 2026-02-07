import { logoutUser } from '../services/auth';
import { useAppStore } from '../store/appStore';
import {
    Home,
    LayoutDashboard,
    AppWindow,
    TrendingUp,
    Users,
    Clock,
    Hash,
    MonitorPlay,
    ListOrdered,
    Search,
    LineChart,
    Download,
    BarChart3,
    Image,
    Target,
    FileEdit,
    X as XIcon,
    FileInput,
    MessageSquare,
    Reply,
    Star,
    FileText,
    Megaphone,
    ChevronRight,
    Eye,
    LogOut,
    User
} from 'lucide-react';
import '../styles/sidebar.css';

const navItems = [
    {
        section: 'OVERVIEW',
        items: [
            { path: '/dashboard', icon: LayoutDashboard, label: 'ASO Dashboard' },
            { path: '/aso-generator', icon: Hash, label: 'ASO Generator', badge: 'new' },
            { path: '/app-overview', icon: AppWindow, label: 'App Overview' },
            { path: '/app-store-performance', icon: TrendingUp, label: 'App Store Performance' },
            { path: '/competitors', icon: Users, label: 'Competitors' },
            { path: '/app-timeline', icon: Clock, label: 'App Timeline' },
        ],
    },
    {
        section: 'ANALYZE KEYWORDS',
        items: [
            { path: '/keyword-research', icon: Hash, label: 'Keyword Research', badge: 'new' },
            { path: '/keyword-monitoring', icon: MonitorPlay, label: 'Keyword Monitoring', badge: 'new' },
            { path: '/ranked-keywords', icon: ListOrdered, label: 'All Ranked Keywords', badge: 'new' },
            { path: '/live-search', icon: Search, label: 'Live Search' },
        ],
    },
    {
        section: 'ANALYZE MARKET',
        items: [
            { path: '/store-visibility', icon: Eye, label: 'Store Visibility', hasSubmenu: true },
            { path: '/app-downloads', icon: Download, label: 'App Downloads' },
            { path: '/download-trends', icon: LineChart, label: 'Download Trends', badge: 'upgrade' },
            { path: '/benchmarks', icon: BarChart3, label: 'Benchmarks', badge: 'upgrade' },
            { path: '/app-creatives', icon: Image, label: 'App Creatives Library', badge: 'upgrade' },
        ],
    },
    {
        section: 'OPTIMIZE STORE LISTING',
        items: [
            { path: '/aso-score', icon: Target, label: 'ASO Score' },
            { path: '/store-listing', icon: FileEdit, label: 'Store Listing', hasSubmenu: true },
            { path: '/changelog', icon: XIcon, label: 'Changelog', badge: 'upgrade' },
            { path: '/import-export', icon: FileInput, label: 'Import & Export' },
        ],
    },
    {
        section: 'RATINGS & REVIEWS',
        items: [
            { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
            { path: '/reply-reviews', icon: Reply, label: 'Reply to Reviews', badge: 'upgrade' },
            { path: '/ratings', icon: Star, label: 'Ratings' },
            { path: '/review-summaries', icon: FileText, label: 'Review Summaries', badge: 'upgrade' },
        ],
    },
    {
        section: 'MY ADS',
        items: [
            { path: '/ads-manager', icon: Megaphone, label: 'Ads Manager' },
        ],
    },
    {
        section: 'SETTINGS',
        items: [
            { path: '/settings', icon: FileEdit, label: 'Settings' },
        ],
    },
];

function Sidebar() {
    const location = useLocation();
    const { sidebarOpen, user } = useAppStore();

    const handleLogout = async () => {
        await logoutUser();
    };

    return (
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <LayoutDashboard color="var(--primary-color)" />
                    <span>ASOLAA</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((section, idx) => (
                    <div key={idx} className="nav-section">
                        <div className="nav-section-title">{section.section}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className={`nav-item-badge ${item.badge}`}>
                                        {item.badge === 'new' ? 'NEW' : 'UPGRADE'}
                                    </span>
                                )}
                                {item.hasSubmenu && <ChevronRight className="nav-item-arrow" size={16} />}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {user && (
                <div className="sidebar-footer" style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    marginTop: 'auto'
                }}>
                    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--primary-color)' }} />
                        ) : (
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="white" />
                            </div>
                        )}
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.displayName || 'User'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.email}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#ff7675' }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
