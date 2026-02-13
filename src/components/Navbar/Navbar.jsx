import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/logo.png';
import styles from './Navbar.module.css';

const themes = [
  { name: 'light', displayName: 'Claro', logoName: 'Ecolote Sol' }, 
  { name: 'dark', displayName: 'Escuro', logoName: 'Ecolote Noite' },
  { name: 'nature', displayName: 'Natureza', logoName: 'Ecolote Flora' },
  { name: 'ocean', displayName: 'Oceano', logoName: 'Ecolote Mar' },
  { name: 'fire', displayName: 'Fogo', logoName: 'Ecolote Chama' },
];

const applyTheme = (themeName) => {
  document.body.className = document.body.className
    .split(' ')
    .filter(cls => !themes.some(t => `theme-${t.name}` === cls) && cls !== 'dark-theme')
    .join(' ');

  const themeClass = themeName === 'dark' ? 'dark-theme' : `theme-${themeName}`;
  document.body.classList.add(themeClass);
  
  localStorage.setItem('theme', themeName);
};

const Navbar = ({ openAuthModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return themes.some(t => t.name === savedTheme) ? savedTheme : 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [themeChangeMessage, setThemeChangeMessage] = useState('');
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const themeMenuToggleRef = useRef(null);
  const navContainerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => {
      const nextState = !prev;
      if (window.innerWidth <= 992) {
        document.body.style.overflow = nextState ? 'hidden' : '';
      }
      return nextState;
    });
    setIsThemeMenuOpen(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setIsThemeMenuOpen(false);
    if (window.innerWidth <= 992) {
      document.body.style.overflow = '';
    }
  }, []);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    if (themeMenuToggleRef.current) {
      themeMenuToggleRef.current.focus();
    }
    setIsThemeMenuOpen(false);
    closeMenu();
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    closeMenu();

    const currentIndex = themes.findIndex(t => t.name === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    setCurrentTheme(nextTheme.name);
    setThemeChangeMessage(`Tema: ${nextTheme.displayName}`);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setThemeChangeMessage('');
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      document.body.style.overflow = '';
    };
  }, []);

  const toggleThemeMenu = (e) => {
    e.stopPropagation();
    setIsThemeMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const handleAdminAreaClick = (e) => {
    e.preventDefault();
    if (openAuthModal) {
      openAuthModal();
    }
    closeMenu();
  };

  const handleFaqClick = (e) => {
    e.preventDefault();
    navigate('/faq');
    closeMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && navContainerRef.current && !navContainerRef.current.contains(event.target) && menuToggleRef.current && !menuToggleRef.current.contains(event.target)) {
        closeMenu();
      }
      if (isThemeMenuOpen && themeMenuToggleRef.current && !themeMenuToggleRef.current.contains(event.target) && navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        const submenu = document.getElementById('theme-submenu');
        if (submenu && !submenu.contains(event.target)) {
          setIsThemeMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isThemeMenuOpen, closeMenu]);

  const currentThemeDisplayName = themes.find(t => t.name === currentTheme)?.displayName || 'Tema';

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      {isMenuOpen && window.innerWidth <= 992 && (
        <div
          className={`${styles.menuOverlay} ${isMenuOpen ? styles.active : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div className={`${styles.container} container`}>
        <div className={styles.logoAreaContainer}>
          <a href="#" className={styles.logo} onClick={handleLogoClick}>
            <img src={Logo} alt="Logo Ecolote" className={styles.logoImage} />
          </a>
          {themeChangeMessage && (
            <span className={styles.themeChangeMessage}>{themeChangeMessage}</span>
          )}
        </div>

        <button
          ref={menuToggleRef}
          className={styles.menuToggle}
          id="menu-toggle"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="navLinksContainer"
          onClick={toggleMenu}
        >
          <div className={`${styles.hamburgerIcon} ${isMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <nav
        ref={navContainerRef}
        id="navLinksContainer"
        className={`${styles.navLinksContainer} ${isMenuOpen ? styles.active : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuTitle}>Menu</span>
        </div>

        <ul className={styles.navLinks}>
          <li><a href="#hero" onClick={closeMenu}>Início</a></li>
          <li><a href="#about" onClick={closeMenu}>Sobre</a></li>
          <li><a href="#features" onClick={closeMenu}>Diferenciais</a></li>
          <li><a href="#how-it-works" onClick={closeMenu}>Funcionamento</a></li>
          <li><a href="#simulation" onClick={closeMenu}>Simulação</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contato</a></li>
          <li><Link to="/faq" onClick={closeMenu}>FAQ</Link></li>

          {admin ? (
            <>
              <li><Link to="/admin/dashboard" onClick={closeMenu}>Dashboard</Link></li>
              <li><Link to="/admin/register" onClick={closeMenu}>Admin</Link></li>
              <li><button onClick={handleLogout} className={styles.navButtonLogout}>Sair</button></li>
            </>
          ) : (
            <li>
              <a href="#" onClick={handleAdminAreaClick} className={styles.navLinkAdmin}>
                Admin
              </a>
            </li>
          )}

          <li className={`${styles.themeMenuContainer} ${isThemeMenuOpen ? styles.open : ''}`}>
            <button
              ref={themeMenuToggleRef}
              className={styles.themeMenuToggle}
              onClick={toggleThemeMenu}
              aria-haspopup="true"
              aria-expanded={isThemeMenuOpen}
              aria-controls="theme-submenu"
              id="theme-menu-toggle"
            >
              Tema: {currentThemeDisplayName}
              <span className={styles.arrowIcon} aria-hidden="true"></span>
            </button>
            <ul
              id="theme-submenu"
              className={styles.themeSubmenu}
              role="menu"
              aria-labelledby="theme-menu-toggle"
              aria-hidden={!isThemeMenuOpen}
            >
              {themes.map(theme => (
                <li key={theme.name} role="none">
                  <button
                    onClick={() => handleThemeChange(theme.name)}
                    className={currentTheme === theme.name ? styles.activeTheme : ''}
                    role="menuitemradio"
                    aria-checked={currentTheme === theme.name}
                  >
                    {theme.displayName}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
