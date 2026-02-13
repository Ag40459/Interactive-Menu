import { useState, useEffect, useRef } from 'react';
import styles from './HowItWorks.module.css';

import HowItWorksImage1 from '../../assets/HowItWorksImage1.png';
import HowItWorksImage2 from '../../assets/HowItWorksImage2.png';
import HowItWorksImage3 from '../../assets/HowItWorksImage3.png';
import HowItWorksImage4 from '../../assets/HowItWorksImage4.png';
import HowItWorksImage5 from '../../assets/HowItWorksImage5.png';
import HowItWorksImage6 from '../../assets/HowItWorksImage6.png';

const steps = [
  {
    id: 1,
    title: 'Cadastro Rápido e Fácil',
    description: 'Inicie sua jornada como proprietário de energia solar com um cadastro simples e objetivo. Sem burocracia, sem complicações – o primeiro passo para sua independência energética.',
    image: HowItWorksImage1,
  },
  {
    id: 2,
    title: 'Escolha Sua Usina Individual',
    description: 'Selecione a usina solar que melhor se adapta ao seu consumo. Diferente de sistemas compartilhados, você será o único dono da sua usina, com todos os créditos gerados exclusivamente para você.',
    image: HowItWorksImage2,
  },
  {
    id: 3,
    title: 'Ingressar na Associação',
    description: 'Ao se tornar proprietário, você também ingressa na nossa associação que otimiza custos e potencializa benefícios. Dessa forma conseguimos reduzir os gastos e facilitar a venda de energia gerada pelo associado.',
    image: HowItWorksImage3,
  },
  {
    id: 4,
    title: 'Acompanhe Pelo App',
    description: 'Monitore a geração da sua usina individual e acompanhe quantos kWh está sendo gerado em tempo real. Visualize seus créditos acumulados e caso decida vender o acumulo, nossa associação te dará o suporte.',
    image: HowItWorksImage4,
  },
  {
    id: 5,
    title: 'Segurança em Múltiplas Camadas',
    description: 'Desfrute de proteção completa: seguro dos equipamentos instalados no seu lote, monitoramento individual e coletivo do bairro solar, respaldo jurídico junto com a associação de proprietários. Seu investimento protegido em todos os níveis.',
    image: HowItWorksImage5,
  },
  {
    id: 6,
    title: 'Bairro Solar Planejado',
    description: 'Seu EcoLote está em um ambiente especialmente projetado sem moradias, apenas as usinas, com áreas verdes preservadas, infraestrutura de qualidade e gestão profissional da associação. Um espaço que valoriza seu investimento e o meio ambiente.',
    image: HowItWorksImage6,
  },
];

const HowItWorks = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const totalSlides = steps.length;
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, steps.length);
  }, [steps]);

  // Manipuladores de eventos de toque para swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50; // Mínimo de distância para considerar um swipe
    
    if (isSwipe) {
      if (distance > 0) {
        // Swipe para a esquerda - próximo slide
        nextSlide();
      } else {
        // Swipe para a direita - slide anterior
        prevSlide();
      }
    }
    
    // Resetar valores
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Toggle expansion para um card específico
  const toggleExpand = (index, event) => {
    event.stopPropagation();
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    setIsPaused(true);
  };

  const nextSlide = () => {
    setExpandedIndex(null);
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setExpandedIndex(null);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setExpandedIndex(null);
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || !carouselRef.current) return;
    const interval = setInterval(nextSlide, 9000);
    return () => clearInterval(interval);
  }, [isPaused, currentSlide]);

  // Scroll carousel to current slide
  useEffect(() => {
    if (carouselRef.current && slideRefs.current[currentSlide]) {
      const scrollLeft = slideRefs.current[currentSlide].offsetLeft;
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  return (
    <section
      id="how-it-works"
      className={`${styles.container}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className={styles.title}>Funcionamento</h2>

      <div className={styles.carouselWrapper}>
        {!isMobile && (
          <button
            className={`${styles.carouselArrow} ${styles.prevArrow}`}
            onClick={prevSlide}
            aria-label="Etapa anterior"
          >
            &#10094;
          </button>
        )}

        <div 
          className={styles.carouselContainer} 
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.carouselTrack}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={el => slideRefs.current[index] = el}
                className={`${styles.carouselSlide} ${index === currentSlide ? styles.activeSlide : ''}`}
              >
                <div
                  className={`${styles.stepCard} ${expandedIndex === index ? styles.expanded : ''}`}
                  onClick={(e) => toggleExpand(index, e)}
                >
                  <div className={styles.cardImageContainer}>
                    <img
                      src={step.image}
                      alt={step.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <div
                      className={styles.descriptionContainer}
                      id={`step-details-${index}`}
                    >
                      <p className={styles.description}>
                        {expandedIndex === index ? step.description : `${step.description.substring(0, 60)}...`}
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.toggleButton}
                    onClick={(e) => toggleExpand(index, e)}
                    aria-expanded={expandedIndex === index}
                    aria-controls={`step-details-${index}`}
                    aria-label={expandedIndex === index ? 'Ver menos' : 'Saiba mais'}
                  >
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isMobile && (
          <button
            className={`${styles.carouselArrow} ${styles.nextArrow}`}
            onClick={nextSlide}
            aria-label="Próxima etapa"
          >
            &#10095;
          </button>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
