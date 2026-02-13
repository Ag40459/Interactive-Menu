import { useState, useEffect, useRef } from 'react';
import styles from './About.module.css'; // Keep using the entry point CSS
import imageAbout from '../../assets/imageAbout.png';
import HorizontalCarousel from '../UI/HorizontalCarousel/HorizontalCarousel'; // Import the carousel

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProfile, setExpandedProfile] = useState(null);
  const sectionRef = useRef(null);

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

    let currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const benefitsData = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.benefitIconSvg}>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Economia Real",
      description: "Reduza sua conta de luz à taxa mínima e obtenha um retorno rápido do seu investimento."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.benefitIconSvg}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Sem Instalação Local",
      description: "Não precisa de telhado próprio ou modificações em sua residência ou negócio."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.benefitIconSvg}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Sustentabilidade",
      description: "Energia 100% limpa e renovável, contribuindo para um planeta mais saudável."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.benefitIconSvg}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Propriedade Real",
      description: "Usina registrada em seu nome, com documentação completa e garantia de 10 anos nos seus equipamentos."
    }
  ];

  const renderBenefitItem = (item) => (
    <div className={styles.benefitCard}>
      {item.icon}
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </div>
  );

  const tabs = [
    {
      title: "O Conceito",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.tabIconSvg}>
          <path d="M12 3v18M5.5 6.5L12 3l6.5 3.5M5.5 17.5L12 21l6.5-3.5M4 10h16M4 14h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      content: (
        <>
          <p>
            O Ecolote é uma <strong>estrutura física de 35m² destinada à geração de energia solar</strong>. Cada unidade está instalada em um bairro rural planejado, em localidade com <strong>elevada irradiação solar</strong>, otimizando sua capacidade produtiva.
          </p>
          <p>
            Cada unidade é um <strong>bem registrado em nome do seu titular</strong>, equipada com tecnologia para <strong>monitoramento da geração</strong> e com <strong>garantias de funcionamento</strong>. Sua unica função é a <strong>produção de energia elétrica limpa</strong> a partir da luz solar.
          </p>
        </>
      )
    },
    {
      title: "Benefícios",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.tabIconSvg}>
          <path d="M12 22c6.075 0 11-4.925 11-11S18.075 0 12 0 1 4.925 1 11s4.925 11 11 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      content: (
        <HorizontalCarousel
          items={benefitsData}
          renderItem={renderBenefitItem}
          itemsPerView={1} // Changed from 3 to 1
          gap={20}
          showControls={true}
        />
      )
    },
    {
      title: "Para Quem",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.tabIconSvg}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      content: (
        <>
          <div className={styles.profilesContainer}>
            <div className={styles.profileItem}>
              <button
                className={`${styles.profileTitleButton} ${expandedProfile === 0 ? styles.expanded : ''}`}
                onClick={() => setExpandedProfile(expandedProfile === 0 ? null : 0)}
              >
                Residências
                <span className={styles.expandIcon}>{expandedProfile === 0 ? '−' : '+'}</span>
              </button>
              {expandedProfile === 0 && (
                <div className={styles.profileDetails}>
                  <ul className={styles.profileList}>
                    <li>Apartamentos</li>
                    <li>Casas alugadas</li>
                    <li>Imóveis sem espaço</li>
                    <li>Residências com telhados inadequados</li>
                    <li>Todas opções do tradicional</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.profileItem}>
              <button
                className={`${styles.profileTitleButton} ${expandedProfile === 1 ? styles.expanded : ''}`}
                onClick={() => setExpandedProfile(expandedProfile === 1 ? null : 1)}
              >
                Empresas
                <span className={styles.expandIcon}>{expandedProfile === 1 ? '−' : '+'}</span>
              </button>
              {expandedProfile === 1 && (
                <div className={styles.profileDetails}>
                  <ul className={styles.profileList}>
                    <li>Comércios em pontos alugados</li>
                    <li>Escritórios em prédios comerciais</li>
                    <li>Empresas com alto consumo energético</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p>
            Seja pessoa física ou jurídica, o Ecolote oferece <strong>planos flexíveis e transparentes</strong>, adaptados ao seu perfil de consumo.
            Faça parte da transformação energética do Brasil com <strong>energia inteligente para você e sustentabilidade para o planeta</strong>.
          </p>
        </>
      )
    }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`${styles.aboutSection} ${isVisible ? styles.visible : ''} content-section`}
    >
      <div className={`${styles.aboutContainer} container`}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleHighlight}>O Que é</span> o Ecolote?
        </h2>
        <div className={styles.aboutContent}>
          <div className={styles.aboutImageColumn}>
            <div className={styles.imageWrapper}>
              <img
                src={imageAbout}
                alt="Usina solar do Ecolote com painéis solares organizados em fileiras em um terreno rural, com sistema de monitoramento e segurança"
                className={styles.aboutImage}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.overlayIconSvg}>
                    <path d="M12 3v18M5.5 6.5L12 3l6.5 3.5M5.5 17.5L12 21l6.5-3.5M4 10h16M4 14h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={styles.overlayText}>Sua Usina Solar</span>
                </div>
              </div>
            </div>
            <p className={styles.imageCaption}>
              Usina solar remota do Ecolote: sua energia limpa sem complicações
            </p>
            <div className={styles.imageFacts}>
              <div className={styles.factItem}>
                <div className={styles.factValue}>35m²</div>
                <div className={styles.factLabel}>Ecolote Padrão</div>
              </div>
              <div className={styles.factItem}>
                <div className={styles.factValue}>10 anos</div>
                <div className={styles.factLabel}>Garantia</div>
              </div>
              <div className={styles.factItem}>
                <div className={styles.factValue}>100%</div>
                <div className={styles.factLabel}>Sua Propriedade</div>
              </div>
            </div>
          </div>

          <div className={styles.aboutTextColumn}>
            <div className={styles.tabsContainer}>
              <div className={styles.tabsHeader}>
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(index)}
                    aria-label={`Ver informações sobre ${tab.title}`}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabTitle}>{tab.title}</span>
                  </button>
                ))}
              </div>
              <div className={styles.tabContent}>
                {tabs[activeTab].content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

