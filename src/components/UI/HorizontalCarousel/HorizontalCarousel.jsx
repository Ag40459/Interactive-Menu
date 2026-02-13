import { useState, useRef, useEffect } from 'react';
import styles from './HorizontalCarousel.module.css';

const HorizontalCarousel = ({ items, renderItem, itemWidth = 300, gap = 20, showControls = true, itemsPerView = 3 }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  
  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.clientWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);
  
  const calculateItemsPerView = () => {
    if (window.innerWidth < 768) {
      return 1; // Mobile
    } else if (window.innerWidth < 1024) {
      return 2; // Tablet
    } else {
      return itemsPerView; // Desktop
    }
  };
  
  const actualItemsPerView = calculateItemsPerView();
  const actualItemWidth = (containerWidth - (gap * (actualItemsPerView - 1))) / actualItemsPerView;
  
  const scrollNext = () => {
    if (carouselRef.current && trackRef.current) {
      const newIndex = Math.min(activeIndex + 1, items.length - actualItemsPerView);
      const newPosition = newIndex * (actualItemWidth + gap);
      trackRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
      setActiveIndex(newIndex);
    }
  };
  
  const scrollPrev = () => {
    if (carouselRef.current && trackRef.current) {
      const newIndex = Math.max(0, activeIndex - 1);
      const newPosition = newIndex * (actualItemWidth + gap);
      trackRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
      setActiveIndex(newIndex);
    }
  };
  
  const handleDotClick = (index) => {
    if (trackRef.current) {
      const newPosition = index * (actualItemWidth + gap);
      trackRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
      setActiveIndex(index);
    }
  };
  
  const handleScroll = () => {
    if (trackRef.current) {
      const newPosition = trackRef.current.scrollLeft;
      setScrollPosition(newPosition);
      const newIndex = Math.round(newPosition / (actualItemWidth + gap));
      setActiveIndex(newIndex);
    }
  };
  
  return (
    <div className={styles.carouselContainer} ref={carouselRef}>
      {showControls && (
        <button 
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={scrollPrev}
          disabled={activeIndex <= 0}
          aria-label="Anterior"
        >
          <span>←</span>
        </button>
      )}
      
      <div 
        className={styles.carouselTrack} 
        ref={trackRef}
        onScroll={handleScroll}
        style={{ 
          gridTemplateColumns: `repeat(${items.length}, ${actualItemWidth}px)`,
          gap: `${gap}px` 
        }}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className={styles.carouselItem}
            style={{ width: `${actualItemWidth}px` }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {showControls && (
        <button 
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={scrollNext}
          disabled={activeIndex >= items.length - actualItemsPerView}
          aria-label="Próximo"
        >
          <span>→</span>
        </button>
      )}
      
      {showControls && items.length > actualItemsPerView && (
        <div className={styles.paginationDots}>
          {Array.from({ length: items.length - actualItemsPerView + 1 }).map((_, index) => (
            <button 
              key={index}
              className={`${styles.paginationDot} ${activeIndex === index ? styles.activeDot : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {activeIndex < items.length - actualItemsPerView && (
        <div className={styles.scrollIndicator}>
          <span>→</span>
        </div>
      )}
    </div>
  );
};

export default HorizontalCarousel;
