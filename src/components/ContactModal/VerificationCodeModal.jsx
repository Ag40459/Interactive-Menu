import React, { useState, useEffect } from 'react';
import styles from './VerificationCodeModal.module.css';

const VerificationCodeModal = ({ isOpen, onClose, onVerify, onResend, onBack, email }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Resetar o código quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
    }
  }, [isOpen]);
  
  // Gerenciar o contador de tempo para reenvio
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  
  // Função para lidar com a verificação do código
  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Por favor, insira o código de verificação');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    
    try {
      await onVerify(code);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Função para lidar com o reenvio do código
  const handleResend = () => {
    if (countdown > 0) return;
    
    onResend();
    setCountdown(60); // Iniciar contador de 60 segundos
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button 
          className={styles.modalCloseButton} 
          onClick={onClose}
          aria-label="Fechar modal"
        >×</button>
        
        <h3 className={styles.modalTitle}>Verificação de Email</h3>
        <p className={styles.modalSubtitle}>
          Enviamos um código de verificação para <strong>{email}</strong>
        </p>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Código de Verificação</label>
          <input
            type="text"
            className={styles.formInput}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Digite o código recebido"
            required
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
        
        <button 
          className={styles.verifyButton}
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verificando...' : 'Verificar Código'}
        </button>
        
        <div className={styles.actionLinks}>
          <button 
            className={styles.resendLink}
            onClick={handleResend}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `Reenviar código (${countdown}s)` : 'Reenviar código'}
          </button>
          
          <button 
            className={styles.backButton}
            onClick={onBack}
            type="button"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeModal;
