import React, { Component } from 'react';
import './Dashboard.css';

const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
};

const svg = (children, size = 20) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        {children}
    </svg>
);

const ICONS = {
    grid: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>),
    user: svg(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
    calendar: svg(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
    clipboard: svg(<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></>),
    users: svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    activity: svg(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
    dollar: svg(<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>),
    contact: svg(<><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,13 2,6" /></>),
    report: svg(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
    menu: svg(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>),
    chevronLeft: svg(<polyline points="15 18 9 12 15 6" />),
    chevronRight: svg(<polyline points="9 18 15 12 9 6" />),
    logout: svg(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
    trend: svg(<><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>, 12)
};

class DashboardLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { collapsed: false, mobileOpen: false };
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        sessionStorage.removeItem('usertoken');
        sessionStorage.removeItem('userData');
        window.location.href = '/';
    }

    render() {
        const { title, items, children } = this.props;
        const { collapsed, mobileOpen } = this.state;
        const path = window.location.pathname;

        return (
            <div className="dash">
                {mobileOpen && (
                    <div className="dash-overlay" onClick={() => this.setState({ mobileOpen: false })} />
                )}

                <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                    <div className="dash-sidebar-header">
                        <span className="dash-brand">
                            <span className="dash-logo">K</span>
                            <span className="dash-brand-text">{title}</span>
                        </span>
                        <button
                            type="button"
                            className="dash-toggle"
                            onClick={() => this.setState({ collapsed: !collapsed })}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? ICONS.chevronRight : ICONS.chevronLeft}
                        </button>
                    </div>

                    <nav className="dash-nav">
                        {items.map(item => (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`dash-link ${path === item.path ? 'active' : ''}`}
                            >
                                <span className="dash-link-icon">{ICONS[item.icon || 'grid']}</span>
                                <span className="dash-link-label">{item.label}</span>
                            </a>
                        ))}
                    </nav>

                    <button type="button" className="dash-logout" onClick={this.handleLogout}>
                        <span className="dash-link-icon">{ICONS.logout}</span>
                        <span className="dash-link-label">Log Out</span>
                    </button>
                </aside>

                <button
                    type="button"
                    className="dash-mobile-toggle"
                    onClick={() => this.setState({ mobileOpen: true })}
                    aria-label="Open menu"
                >
                    {ICONS.menu}
                </button>

                <main className={`dash-main ${collapsed ? 'collapsed' : ''}`}>
                    {children}
                </main>
            </div>
        );
    }
}

export default DashboardLayout;
