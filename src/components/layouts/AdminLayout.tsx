import { Outlet, Link, useLocation } from "react-router-dom";
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
} from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/admin', icon: HomeOutlined, label: 'Dashboard' },
    { path: '/admin/imoveis', icon: AppstoreOutlined, label: 'Imóveis' },
    { path: '/admin/leads', icon: TeamOutlined, label: 'Leads' },
    { path: '/admin/visitas', icon: CalendarOutlined, label: 'Visitas' },
    { path: '/admin/configuracoes', icon: SettingOutlined, label: 'Configurações' },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <RocketOutlined />
          </div>
          {!collapsed && (
            <div className={styles.logoText}>
              Imobi<span className={styles.logoAccent}>Lux</span>
            </div>
          )}
        </div>

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
                className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
              >
                <div className={styles.navLinkIcon}>
                  <Icon />
                </div>
                {!collapsed && <span className={styles.navLinkText}>{item.label}</span>}
                {isActive(item.path) && <div className={styles.navLinkIndicator} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          <div className={styles.navLinkIcon}>
            <LogoutOutlined />
          </div>
          {!collapsed && <span className={styles.navLinkText}>Sair</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`${styles.mainContent} ${collapsed ? styles.mainContentExpanded : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
