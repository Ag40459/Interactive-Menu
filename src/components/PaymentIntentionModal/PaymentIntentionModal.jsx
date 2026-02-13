import React, { useState } from 'react';
import styles from './PaymentIntentionModal.module.css';

/**
 * Modal para capturar a intenção de pagamento do usuário
 * após decidir fazer o pré-cadastro
 */
const PaymentIntentionModal = ({ isOpen, onClose, onConfirm, email }) => {
  const [paymentIntention, setPaymentIntention] = useState('');
  
  if (!isOpen) return null;
  
  const handleConfirm = () => {
    if (!paymentIntention) {
      alert('Por favor, selecione uma opção de pagamento');
      return;
    }
    onConfirm(paymentIntention);
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Preferência de Pagamento</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Para personalizarmos sua experiência, informe como prefere realizar o pagamento:
          </p>
          
          <div className={styles.optionsContainer}>
            <div 
              className={`${styles.optionCard} ${paymentIntention === 'a_vista' ? styles.selected : ''}`}
              onClick={() => setPaymentIntention('a_vista')}
            >
              <div className={styles.optionIcon}>💰</div>
              <h4>À Vista</h4>
              <p>Pagamento integral com descontos especiais</p>
            </div>
            
            <div 
              className={`${styles.optionCard} ${paymentIntention === 'financiado' ? styles.selected : ''}`}
              onClick={() => setPaymentIntention('financiado')}
            >
              <div className={styles.optionIcon}>🏦</div>
              <h4>Financiado</h4>
              <p>Parcelas mensais através de instituições financeiras</p>
            </div>
            
            <div 
              className={`${styles.optionCard} ${paymentIntention === 'parcelado' ? styles.selected : ''}`}
              onClick={() => setPaymentIntention('parcelado')}
            >
              <div className={styles.optionIcon}>📅</div>
              <h4>Parcelado</h4>
              <p>Dividido em parcelas direto com a EcoPower</p>
            </div>
          </div>
          
          <div className={styles.userEmail}>
            <p>Email para confirmação: <strong>{email}</strong></p>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              className={styles.confirmButton} 
              onClick={handleConfirm}
              disabled={!paymentIntention}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentIntentionModal;
