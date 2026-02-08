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
        section: 'MONITOR',
        items: [
            { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/competitors', icon: Users, label: 'Competitors' },
            { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
        ],
    },
    {
        section: 'RESEARCH & IDEAS',
        items: [
            { path: '/market-trends', icon: TrendingUp, label: 'Market Trends', badge: 'new' },
            { path: '/keyword-research', icon: Search, label: 'Keyword Research' },
        ],
    },
    {
        section: 'OPTIMIZE',
        items: [
            { path: '/aso-generator', icon: Hash, label: 'ASO Generator' },
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
