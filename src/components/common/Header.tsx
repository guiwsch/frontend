import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, LoginOutlined } from '@ant-design/icons';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo}>
            Junior<span className={styles.logoAccent}> Corretor</span>
          </Link>
          <div
            className={`${styles.navLinks} ${
              isMenuOpen ? styles.open : styles.closed
            }`}
          >
            <Link to="/" className={styles.navLink} onClick={closeMenu}>
              Início
            </Link>
            <Link
              to="/imoveis?tipo_negocio=aluguel"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Alugar
            </Link>
            <Link
              to="/imoveis?tipo_negocio=venda"
              className={styles.navLink}
              onClick={closeMenu}
            >
              Comprar
            </Link>
            <Link to="/sobre" className={styles.navLink} onClick={closeMenu}>
              Sobre
            </Link>
            <Link to="/contato" className={styles.navLink} onClick={closeMenu}>
              Contato
            </Link>
            <Link
              to="/admin"
              className={styles.loginButton}
              onClick={closeMenu}
            >
              <LoginOutlined /> Login
            </Link>
          </div>
          <button className={styles.menuButton} onClick={toggleMenu}>
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </nav>
      </header>
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`}
        onClick={closeMenu}
      />
    </>
  );
};

export default Header;
