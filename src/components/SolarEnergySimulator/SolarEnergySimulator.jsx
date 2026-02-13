import { useState} from 'react';
import styles from './SolarEnergySimulator.module.css';
import InitialSimulator from '../InitialSimulator/InitialSimulator';
import SimulationModal from '../SimulationModal/SimulationModal';

function SolarEnergySimulator() {
  const [showModal, setShowModal] = useState(false);
  const [billValue, setBillValue] = useState(200);

  const handleSimulate = (value) => {
    setBillValue(value);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.solarEnergySimulator}>
      <div className={styles.decorativeSun} aria-hidden="true"></div>
      <InitialSimulator onSimulate={handleSimulate} />
    
      {showModal && (
        <SimulationModal 
          initialValue={billValue} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default SolarEnergySimulator;
