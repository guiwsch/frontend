import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  RocketOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Previne scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    { path: '/admin', icon: HomeOutlined, label: 'Dashboard' },
    { path: '/admin/imoveis', icon: AppstoreOutlined, label: 'Imóveis' },
    { path: '/admin/leads', icon: TeamOutlined, label: 'Leads' },
    { path: '/admin/visitas', icon: CalendarOutlined, label: 'Visitas' },
    {
      path: '/admin/configuracoes',
      icon: SettingOutlined,
      label: 'Configurações',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Mobile Header - Apenas visível em mobile */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileHeaderContent}>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
          <div className={styles.mobileLogoContainer}>
            <div className={styles.logoIcon}>
              <RocketOutlined />
            </div>
            <div className={styles.logoText}>
              Imobi<span className={styles.logoAccent}>Lux</span>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Mobile */}
      <div
        className={`${styles.mobileOverlay} ${
          mobileMenuOpen ? styles.mobileOverlayOpen : ''
        }`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          collapsed ? styles.sidebarCollapsed : ''
        } ${mobileMenuOpen ? styles.sidebarMobileOpen : ''}`}
      >
        {/* Logo */}
        {/* <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <RocketOutlined />
          </div>
          {!collapsed && (
            <div className={styles.logoText}>
              Imobi<span className={styles.logoAccent}>Lux</span>
            </div>
          )}
        </div> */}

        {/* Toggle Button */}
        <button
          className={styles.toggleButton}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${
                  isActive(item.path) ? styles.navLinkActive : ''
                }`}
              >
                <div className={styles.navLinkIcon}>
                  <Icon />
                </div>
                {!collapsed && (
                  <span className={styles.navLinkText}>{item.label}</span>
                )}
                {isActive(item.path) && (
                  <div className={styles.navLinkIndicator} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* View Site Button */}
        <Link to="/" className={styles.viewSiteButton}>
          <div className={styles.navLinkIcon}>
            <GlobalOutlined />
          </div>
          {!collapsed && (
            <span className={styles.navLinkText}>Ir à Página</span>
          )}
        </Link>

        {/* Logout Button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          <div className={styles.navLinkIcon}>
            <LogoutOutlined />
          </div>
          {!collapsed && <span className={styles.navLinkText}>Sair</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`${styles.mainContent} ${
          collapsed ? styles.mainContentExpanded : ''
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
