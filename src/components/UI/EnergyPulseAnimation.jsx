import React from 'react';
import styles from './EnergyPulseAnimation.module.css';

// Componente de animação para o canto superior esquerdo
const EnergyPulseAnimation = () => (
  <div className={styles.energyPulseContainer}>
    <div className={styles.energyPulseOuter}></div>
    <div className={styles.energyPulseMiddle}></div>
    <div className={styles.energyPulseInner}></div>
  </div>
);

export default EnergyPulseAnimation;
