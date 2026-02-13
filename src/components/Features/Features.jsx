import { useState, useRef, useEffect } from 'react';
import styles from './Features.module.css';
import { FaLeaf, FaMoneyBillWave, FaKey, FaCoins, FaMicrochip, FaUsers, FaChartLine, FaShieldAlt, FaNetworkWired, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categories = [
  { id: 'economia', name: 'Economia' },
  { id: 'sustentabilidade', name: 'Sustentabilidade' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'acesso', name: 'Flexibilidade' }
];

const featuresByCategory = {
  economia: [
    {
      title: 'Economia Inteligente',
      description: 'Tenha sua própria usina solar com gestão facilitada e economia real.',
      details: 'Ao adquirir um Ecolote, o cliente é dono da usina e da energia gerada. A associação cuida da gestão administrativa e permite, por meio de regras flexíveis, repassar a energia para terceiros caso o cliente deseje vender ou alugar sua produção.',
      icon: <FaMoneyBillWave />
    },
    {
      title: 'Economia que Gera Valor',
      description: 'Economize na conta de energia consumindo a energia que você gera.',
      details: 'Embora o foco seja o consumo próprio, clientes que geram excedente podem vender essa energia, aumentando a rentabilidade e acelerando o retorno do investimento.',
      icon: <FaCoins />
    },
    {
      title: 'Retorno do Investimento',
      description: 'Recupere seu investimento em até 5 anos com economia mensal garantida.',
      details: 'O modelo Ecolote oferece um dos melhores retornos do mercado, com payback entre 4 e 5 anos e economia mensal imediata na conta de energia.',
      icon: <FaChartLine />
    }
  ],
  sustentabilidade: [
    {
      title: 'Sustentabilidade Real',
      description: 'Contribua ativamente com o meio ambiente através de energia limpa e renovável.',
      details: 'Cada Ecolote gera entre 4,8 e 12 MWh por ano, evitando de 2,4 a 6 toneladas de CO₂ — equivalente a plantar de 115 a 285 árvores por ano.',
      icon: <FaLeaf />
    },
    {
      title: 'Impacto Ambiental Positivo',
      description: 'Reduza sua pegada de carbono e contribua para um futuro mais sustentável.',
      details: 'Ao optar pelo Ecolote, você evita a emissão de gases de efeito estufa, economiza recursos hídricos e reduz a dependência de combustíveis fósseis, gerando um impacto ambiental positivo e mensurável.',
      icon: <FaLeaf />
    }
  ],
  tecnologia: [
    {
      title: 'Tecnologia de Ponta',
      description: 'Usinas com painéis solares de alta performance e monitoramento remoto avançado.',
      details: 'Oferecemos 10 anos de garantia nos equipamentos e 25 anos contra perda de potência, com substituição garantida caso a geração fique abaixo de 80%. Utilizamos tecnologia de medição de energia em tempo real, além de monitoramento individual por câmera, permitindo que você acompanhe sua usina e consumo a qualquer momento, com transparência e segurança.',
      icon: <FaMicrochip />
    },
    {
      title: 'Inteligência Artificial',
      description: 'Sistema de previsão e otimização de geração baseado em IA.',
      details: 'Nossa plataforma utiliza algoritmos de inteligência artificial para prever a geração de energia com base em dados meteorológicos e históricos, otimizando o desempenho da sua usina e maximizando o retorno do investimento.',
      icon: <FaMicrochip />
    },
    {
      title: 'Compensação de Energia com Segurança',
      description: 'Registro seguro dos créditos de energia gerada e não consumida.',
      details: 'A energia excedente gerada pela sua usina é registrada pela distribuidora de energia e convertida em créditos válidos por até 5 anos. Esses registros seguem normas da ANEEL e garantem rastreabilidade e segurança na compensação do consumo em outras unidades.',
      icon: <FaShieldAlt />
    },
    {
      title: 'Rede Neural Avançada',
      description: 'Monitoramento preditivo para manutenção preventiva.',
      details: 'Nossa rede neural analisa continuamente o desempenho dos equipamentos, identificando padrões que podem indicar necessidade de manutenção antes que ocorram falhas, garantindo máxima eficiência e disponibilidade da sua usina.',
      icon: <FaNetworkWired />
    }
  ],
  acesso: [
    {
      title: 'Acesso Descomplicado para Todos os Perfis',
      description: 'Sua própria usina solar, 100% sua, mesmo sem ter telhado ou instalar painéis no imóvel.',
      details: 'Moradores de apartamentos, locatários, empresas em pontos alugados e quem não tem espaço para instalação podem ter uma usina remota, dedicada e permanente — energia limpa e sustentável sem obras ou alterações no imóvel.',
      icon: <FaKey />
    },
    {
      title: 'Comunidade Engajada',
      description: 'Participe de uma rede de clientes conscientes, unidos por um modelo inteligente de geração de energia.',
      details: 'A associação cuida da gestão de cada Ecolote, garantindo o repasse integral da energia gerada para o titular. Além disso, promove uma estrutura colaborativa que reduz custos operacionais, facilita a administração coletiva e oferece segurança jurídica para todos os associados.',
      icon: <FaUsers />
    }
  ]
};

export default function Features() {
  const [selectedCategory, setSelectedCategory] = useState('tecnologia');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const carouselRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const currentFeatures = featuresByCategory[selectedCategory] || [];

  useEffect(() => {
    setExpandedIndex(null);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    checkArrows();
  }, [selectedCategory]);

  const toggleExpand = (index, event) => {
    event.stopPropagation();
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const checkArrows = () => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => {
      window.removeEventListener('resize', checkArrows);
    };
  }, [currentFeatures]);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderFeatureCard = (feature, index) => (
    <div
      key={`${selectedCategory}-${index}`}
      className={`${styles.featureCard} ${expandedIndex === index ? styles.expanded : ''}`}
      onClick={(e) => toggleExpand(index, e)}
    >
      <div className={styles.cardImageContainer}>
        <div className={styles.cardImagePlaceholder}>
          {feature.icon}
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.featureTitle}>{feature.title}</h3>
        <div
          className={styles.descriptionContainer}
          id={`feature-details-${index}`}
        >
          <p className={styles.featureDescription}>
            {expandedIndex === index ? feature.description : `${feature.description.substring(0, 60)}...`}
          </p>
          {expandedIndex === index && (
            <p className={styles.featureDetailsExpanded}>
              {feature.details}
            </p>
          )}
        </div>
      </div>
      <button
        className={styles.toggleButton}
        onClick={(e) => toggleExpand(index, e)}
        aria-expanded={expandedIndex === index}
        aria-controls={`feature-details-${index}`}
        aria-label={expandedIndex === index ? 'Ver menos' : 'Saiba mais'}
      >
      </button>
    </div>
  );

  return (
    <section id="features" className={styles.featuresContainer}>
      <h2 className={styles.title}>Diferenciais</h2>

      <div className={styles.categoriesNav}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className={styles.carouselContainer}>
        {showArrows && (
          <button
            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
            onClick={() => handleScroll('left')}
            aria-label="Anterior"
          >
            <FaChevronLeft />
          </button>
        )}

        <div className={styles.carousel} ref={carouselRef}>
          {currentFeatures.map((feature, index) =>
            renderFeatureCard(feature, index)
          )}
        </div>

        {showArrows && (
          <button
            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
            onClick={() => handleScroll('right')}
            aria-label="Próximo"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}


