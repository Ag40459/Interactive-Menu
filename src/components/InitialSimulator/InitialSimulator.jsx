import { useState, useEffect, useRef } from 'react';
import styles from './InitialSimulator.module.css';
import { formatCurrency } from '../../utils/calc';

const InitialSimulator = ({ onSimulate }) => {
  const [billValue, setBillValue] = useState(200);
  const [formattedBillValue, setFormattedBillValue] = useState('');
  const [sliderValue, setSliderValue] = useState(20); // Valor inicial do slider (%)
  const isUserTyping = useRef(false);

  // Formatar o valor inicial
  useEffect(() => {
    if (!isUserTyping.current) {
      setFormattedBillValue(formatCurrency(billValue.toString(), 'input'));
    }
  }, [billValue]);

  // Mapear o valor do slider para o valor da conta (de 100 a 2000)
  useEffect(() => {
    if (!isUserTyping.current) {
      const mappedValue = Math.round((sliderValue / 100) * 1900 + 100);
      setBillValue(mappedValue);
    }
  }, [sliderValue]);

  // Função para lidar com a mudança no valor da conta
  const handleBillValueChange = (e) => {
    isUserTyping.current = true;
    
    // Obtém o valor atual do input
    const inputValue = e.target.value;
    
    // Remove tudo que não for dígito ou vírgula
    const cleanValue = inputValue.replace(/[^\d,]/g, '');
    
    // Formata o valor para exibição
    setFormattedBillValue(cleanValue);
    
    // Converte para número para uso interno
    const numericValue = parseFloat(cleanValue.replace(/\./g, '').replace(',', '.')) || 0;
    
    // Atualiza o valor interno
    setBillValue(numericValue);
    
    // Atualiza o slider apenas se o valor estiver dentro dos limites
    if (numericValue >= 100 && numericValue <= 2000) {
      const newSliderValue = ((numericValue - 100) / 1900) * 100;
      setSliderValue(newSliderValue);
    }
    
    // Reseta a flag após um pequeno delay para permitir que o usuário continue digitando
    setTimeout(() => {
      isUserTyping.current = false;
    }, 500);
  };

  // Função para formatar o valor quando o input perde o foco
  const handleBlur = () => {
    isUserTyping.current = false;
    
    // Limitar entre 0 e 2000
    const limitedValue = Math.min(Math.max(billValue, 0), 2000);
    
    // Atualiza com o valor formatado
    setBillValue(limitedValue);
    setFormattedBillValue(formatCurrency(limitedValue, 'input'));
    
    // Atualiza o slider
    if (limitedValue >= 100) {
      const newSliderValue = ((limitedValue - 100) / 1900) * 100;
      setSliderValue(newSliderValue);
    } else {
      setSliderValue(0);
    }
  };

  // Função para lidar com a mudança no slider
  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Garante que o valor esteja dentro dos limites antes de enviar
    const finalValue = Math.min(Math.max(billValue, 100), 2000);
    
    if (onSimulate) {
      onSimulate(finalValue);
    }
  };

  return (
    <section id='simulation' className={styles.simulationSection}>
      <div className={styles.simulationContainer}>
        <div className={styles.simulationContent}>
          <div className={styles.energyPulseContainer}>
            <div className={styles.energyPulseOuter}></div>
            <div className={styles.energyPulseMiddle}></div>
            <div className={styles.energyPulseInner}></div>
          </div>
          
          <h2 className={styles.simulationTitle}>Valor Do Seu Ecolote</h2>
          <p className={styles.simulationSubtitle}>
            Descubra em segundos a média de quanto custará seu Ecolote
          </p>
          
          <form onSubmit={handleSubmit} className={styles.simulationForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Média mensal de gasto com energia:
              </label>
              
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className={styles.slider}
                  aria-label="Ajustar valor da conta de energia"
                />
                <div 
                  className={styles.sliderProgress} 
                  style={{ width: `${sliderValue}%` }}
                ></div>
              </div>
              
              <div className={styles.currencyInputWrapper}>
                <span className={styles.currencyPrefix}>R$</span>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formattedBillValue}
                  onChange={handleBillValueChange}
                  onBlur={handleBlur}
                  required
                  aria-label="Valor médio mensal da conta de energia"
                />
              </div>
            </div>
            
            <button type="submit" className={styles.simulateButton}>
              <span className={styles.buttonText}>Simular Economia</span>
              <span className={styles.buttonIcon}>→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default InitialSimulator;
