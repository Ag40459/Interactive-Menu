import styles from './AnimatedBackground.module.css';

const AnimatedBackground = () => {
  const renderSolarParticles = () => {
    const particles = [];
    for (let i = 0; i < 8; i++) {
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
    <div className={styles.animatedBackground}>
      <div className={styles.solarPattern}></div>
      <div className={styles.solarParticles}>
        {renderSolarParticles()}
      </div>
    </div>
  );
};

export default AnimatedBackground;