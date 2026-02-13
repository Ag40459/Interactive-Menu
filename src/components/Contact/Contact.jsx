import { useState, useEffect, useRef } from 'react';
import styles from './Contact.module.css';
import SimulationModal from '../SimulationModal/SimulationModal.jsx';

// --- Ícones Placeholder --- 
const PropertyIcon = () => <span style={{ fontSize: '2rem' }}>🔑</span>; 
const SecurityIcon = () => <span style={{ fontSize: '2rem' }}>🛡️</span>;
const SustainabilityIcon = () => <span style={{ fontSize: '2rem' }}>🌱</span>;
// --- Fim Ícones Placeholder ---

const ContactSection = () => {
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const openSimulationModal = () => setIsSimulationModalOpen(true);
  const closeSimulationModal = () => setIsSimulationModalOpen(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const renderSolarParticles = () => {
    const particles = [];
    for (let i = 0; i < 10; i++) {
      particles.push(
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        ></div>
      );
    }
    return particles;
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`${styles.contactSection} ${isVisible ? styles.visible : ''} content-section`}
    >
      <div className={styles.contactBackground}>
        <div className={styles.energyWaves}>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
        </div>
        <div className={styles.solarParticles}>
          {renderSolarParticles()}
        </div>
      </div>

      <div className={`${styles.contactContainer} container`}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>Fale Conosco</span> e Faça Seu Pré-Cadastro
        </h2>

        <div className={styles.contactContent}>
          {/* Coluna Esquerda: Conteúdo Exclusivo para Desktop */}
          <div className={styles.contactInfoDesktopOnly}>
            <div className={styles.desktopInfoCard}>
              <div className={styles.desktopInfoIcon}> <PropertyIcon /> </div>
              <div className={styles.desktopInfoText}>
                <h3>Sua Usina, Sua Propriedade</h3>
                <p>Diferente de aluguel de cotas, no Ecolote a mini usina é sua, com escritura registrada em seu nome. Um ativo real que valoriza.</p>
              </div>
            </div>

            <div className={styles.desktopInfoCard}>
              <div className={styles.desktopInfoIcon}> <SecurityIcon /> </div>
              <div className={styles.desktopInfoText}>
                <h3>Investimento Seguro e Garantido</h3>
                <p>Oferecemos 10 anos de garantia nos equipamentos e até 25 anos para perda de potência, monitoramento 24/7 e seguro. Nossa associação garante a gestão e manutenção.</p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Ação de Pré-Cadastro */}
          <div className={styles.contactAction}>
            <div className={styles.actionCard}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  Pronto para Investir no Seu Futuro Energético?
                </h3>
                <p className={styles.cardText}>
                  Faça seu pré-cadastro agora mesmo e garanta:
                </p>
                <div className={styles.benefitsList}>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitCheck}>✓</div>
                    <span>Preço especial de pré-cadastro</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitCheck}>✓</div>
                    <span>Atendimento prioritário</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitCheck}>✓</div>
                    <span>Simulação personalizada</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitCheck}>✓</div>
                    <span>Sem compromisso de compra</span>
                  </div>
                </div>
                <button
                  onClick={openSimulationModal}
                  className={`${styles.reserveButton} ${styles.energyButton}`}
                >
                  <span className={styles.buttonText}>Faça Sua Reserva</span>
                  <span className={styles.buttonIcon}>→</span>
                  <span className={styles.buttonPulse}></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactFooter}>
          <div className={styles.tagline}>
            <strong>Ecolote: Energia limpa para todos – um novo Brasil começa aqui</strong>
            <span className={styles.taglineIcons}>🌱⚡</span>
          </div>
        </div>
      </div>

      {isSimulationModalOpen && (
        <SimulationModal
          initialValue={200}
          onClose={closeSimulationModal}
        />
      )}
    </section>
  );
};

export default ContactSection;
