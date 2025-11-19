import { Outlet, Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Admin</div>
        <nav className={styles.navMenu}>
          <Link to="/admin" className={styles.navLink}>
            <HomeOutlined className={styles.navLinkIcon} />
            <span className={styles.navLinkText}>Dashboard</span>
          </Link>
          <Link to="/admin/imoveis" className={styles.navLink}>
            <AppstoreOutlined className={styles.navLinkIcon} />
            <span className={styles.navLinkText}>Imóveis</span>
          </Link>
          <Link to="/admin/leads" className={styles.navLink}>
            <TeamOutlined className={styles.navLinkIcon} />
            <span className={styles.navLinkText}>Leads</span>
          </Link>
          <Link to="/admin/visitas" className={styles.navLink}>
            <CalendarOutlined className={styles.navLinkIcon} />
            <span className={styles.navLinkText}>Visitas</span>
          </Link>
          <Link to="/admin/configuracoes" className={styles.navLink}>
            <SettingOutlined className={styles.navLinkIcon} />
            <span className={styles.navLinkText}>Configurações</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogoutOutlined className={styles.navLinkIcon} />
          <span className={styles.navLinkText}>Sair</span>
        </button>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
