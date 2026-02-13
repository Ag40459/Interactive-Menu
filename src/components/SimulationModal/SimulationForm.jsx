import { useState, useEffect } from 'react';
import styles from '../SimulationModal/SimulationModal.module.css';
import EnergyPulseAnimation from '../UI/EnergyPulseAnimation' ;

const SimulationForm = ({ 
  initialValue, 
  profileType, 
  cep, 
  name, 
  email, 
  phone, 
  address, 
  loadingCep, 
  cepError, 
  onSubmit, 
  onClose, 
  onProfileTypeChange, 
  onCepChange, 
  onNameChange, 
  onEmailChange, 
  onPhoneChange, 
  cnpj, 
  nomeResponsavel, 
  telefoneResponsavel, 
  onCnpjChange, 
  onNomeResponsavelChange, 
  onTelefoneResponsavelChange,
  onBillValueChange 
}) => {
  const [billValue, setBillValue] = useState('');
  const [numericBillValue, setNumericBillValue] = useState(0);

  useEffect(() => {
    if (initialValue) {
      const formattedValue = initialValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setBillValue(formattedValue);
      setNumericBillValue(initialValue);
    }
  }, [initialValue]);

  const handleBillValueChange = (e) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, '');
    let formattedValue = '';
    if (digits) {
      const numericValue = parseFloat(digits) / 100;
      formattedValue = numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    setBillValue(formattedValue);
    const numericValue = digits ? parseFloat(digits) / 100 : 0;
    setNumericBillValue(numericValue);
    onBillValueChange(numericValue);
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();
    onSubmit(numericBillValue); 
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <button 
          id='simulation'
          className={styles.modalCloseButton} 
          onClick={onClose}
          aria-label="Fechar modal"
        >×</button>
        <div className={styles.modalIllustration}>
          <EnergyPulseAnimation />
        </div>
      </div>
      
      <div className={styles.modalContent}>
        <h2 className={`${styles.modalTitle} sectionTitle`}>Custo Da Usina Solar</h2>
                
        <form onSubmit={handleSubmitInternal}>
          {/* Input Valor da Conta - Label removido, placeholder adicionado */}
              <span className={styles.currencySymbol2}>Custo médio mensal da sua conta de energia.</span>
          <div className={styles.formGroup} style={{"--animation-order": 1}}>

            <div className={styles.inputGroup}>
              <span className={styles.currencySymbol}>R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={billValue}
                onChange={handleBillValueChange}
                placeholder="Valor médio da conta de luz"
                className={styles.simulatorInput}
                required
                aria-label="Valor médio mensal da conta de energia" 
              />
            </div>
          </div>
          
          {/* Tipo de Uso - Label removido, botões ajustados na próxima etapa */}
          <div className={styles.formGroup} style={{"--animation-order": 2}}>
            {/* <label className={styles.formLabel}>Tipo de uso:</label> - Removido */}
            <div className={styles.radioGroup}> 
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="pessoal"
                  name="profileType"
                  value="pessoal"
                  checked={profileType === 'pessoal'}
                  onChange={() => onProfileTypeChange('pessoal')}
                  className={styles.radioInput}
                />
                <label htmlFor="pessoal" className={styles.radioLabel}>Residência</label>
              </div>
              
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="empresa"
                  name="profileType"
                  value="empresa"
                  checked={profileType === 'empresa'}
                  onChange={() => onProfileTypeChange('empresa')}
                  className={styles.radioInput}
                />
                <label htmlFor="empresa" className={styles.radioLabel}>Empresa</label>
              </div>
              
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="investidor"
                  name="profileType"
                  value="investidor"
                  checked={profileType === 'investidor'}
                  onChange={() => onProfileTypeChange('investidor')}
                  className={styles.radioInput}
                />
                <label htmlFor="investidor" className={styles.radioLabel}>Investidor</label>
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup} style={{"--animation-order": 3}}>
            <input
              type="text"
              className={styles.formInput}
              value={cep}
              onChange={onCepChange}
              placeholder={profileType === 'empresa' ? 'CEP' : 'CEP'}
              required
              aria-label="CEP para instalação"
            />
            {loadingCep && <p className={styles.loadingMessage}>Buscando CEP...</p>}
            {cepError && <p className={styles.errorMessage}>{cepError}</p>}
          </div>
          
          <div className={styles.formGroup} style={{"--animation-order": 4}}>
            <input
              type="text"
              className={styles.formInput}
              value={name}
              onChange={onNameChange}
              placeholder={profileType === 'empresa' ? 'Razão Social' : 'Nome Completo'}
              required
              aria-label={profileType === 'empresa' ? 'Razão Social' : 'Nome completo'}
            />
          </div>
          
          <div className={styles.formGroup} style={{"--animation-order": 5}}>
            <input
              type="email"
              className={styles.formInput}
              value={email}
              onChange={onEmailChange}
              placeholder={profileType === 'empresa' ? 'Email Comercial' : 'Email'}
              required
              aria-label={profileType === 'empresa' ? 'Email comercial' : 'Endereço de email'}
            />
          </div>
          
          {/* Input Telefone - Label removido, placeholder ajustado */}
          <div className={styles.formGroup} style={{"--animation-order": 6}}>
            <input
              type="tel"
              className={styles.formInput}
              value={phone}
              onChange={onPhoneChange}
              placeholder={profileType === 'empresa' ? 'Telefone Comercial' : 'Telefone'}
              required
              aria-label={profileType === 'empresa' ? 'Telefone comercial' : 'Número de telefone ou WhatsApp'}
            />
          </div>

          {profileType === 'empresa' && (
            <>
              <div className={styles.formGroup} style={{"--animation-order": 7}}>
                <input
                  type="text"
                  className={styles.formInput}
          maxLength={18}
                  value={cnpj}
                  onChange={onCnpjChange}
                  placeholder="CNPJ"
                  required
                  aria-label="CNPJ da empresa"
                />
              </div>

              <div className={styles.formGroup} style={{"--animation-order": 8}}>
                <input
                  type="text"
                  className={styles.formInput}
                  value={nomeResponsavel}
                  onChange={onNomeResponsavelChange}
                  placeholder="Nome do Responsável"
                  required
                  aria-label="Nome do responsável pela empresa"
                />
              </div>

              <div className={styles.formGroup} style={{"--animation-order": 9}}>
                <input
                  type="tel"
                  className={styles.formInput}
                  value={telefoneResponsavel}
                  onChange={onTelefoneResponsavelChange}
                  placeholder="Telefone do Responsável (00) 00000-0000"
                  required
                  aria-label="Telefone do responsável pela empresa"
                />
              </div>
            </>
          )}
          
          <button type="submit" className={`${styles.submitButton} cta-button`}>
            Valor do meu Ecolote
          </button>
        </form>
      </div>
    </>
  );
};

export default SimulationForm;

