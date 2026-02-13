import { useState, useEffect } from 'react';
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mostra o botão quando o scroll passar de 300px
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Leva ao topo da página suavemente
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={styles.scrollToTopContainer}>
            {isVisible && 
                <button onClick={scrollToTop} className={styles.scrollToTopButton} title="Voltar ao topo">
                    &#8679; {/* Código HTML para seta para cima */}
                </button>
            }
        </div>
    );
};

export default ScrollToTopButton;
