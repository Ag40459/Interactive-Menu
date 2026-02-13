import styles from './Footer.module.css'; 
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Ecolote. Todos os direitos reservados.</p>
      <div className={styles.contact}>
        {/* Ícone de email */}
        <a href="mailto:contato@ecolote.com.br" className={styles.emailLink}>
          <FiMail className={styles.emailIcon} />
          contato@ecolote.com.br
        </a>
      </div>
      <div className={styles.socialLinks}>
        {/* Redes sociais 
        <a href="https://www.instagram.com/yourprofile" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com/yourprofile" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://www.youtube.com/yourchannel" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
          <FaYoutube />
        </a>
        <a href="https://www.tiktok.com/@yourprofile" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
          <FaTiktok />
        </a>
        */}
      </div>
    </footer>
  );
};

export default Footer;
