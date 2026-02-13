import React, { useState, useEffect } from 'react';
import { solarCalculator, formatCurrency } from '../../utils/calc';
import styles from './CommercialProposal.module.css';

const CommercialProposal = () => {
  const [showModal, setShowModal] = useState(true);
  const [energyBillValue, setEnergyBillValue] = useState('');
  const [proposalData, setProposalData] = useState(null);
  const [proposalNumber, setProposalNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    generateProposalNumber();
  }, []);

  const generateProposalNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setProposalNumber(`${timestamp.slice(-6)}${random}`);
  };

  const handleModalSubmit = () => {
    if (!energyBillValue || !customerName) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const billValue = parseFloat(energyBillValue.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (billValue <= 0) {
      alert('Por favor, insira um valor válido para a conta de energia.');
      return;
    }

    const calculationResult = solarCalculator({
      monthlyBill: billValue,
      location: "Iguaracy - PE",
      energyRate: 1.03,
      solarIrradiance: 5.3
    });

    setProposalData(calculationResult);
    setShowModal(false);
  };

  const handleEnergyBillChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
      value = (parseInt(value) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = 'R$ ' + value;
    }
    setEnergyBillValue(value);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Olá! Gostaria de personalizar minha proposta de energia solar. Número da proposta: ${proposalNumber}`);
    window.open(`https://wa.me/5544909042140?text=${message}`, '_blank');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('pt-BR');
  };

  const getValidityDate = () => {
    return "20/08/2025";
  };

  const generateInstallmentOptions = (totalValue) => {
    const interestRate = 0.0156;
    const options = [36, 48, 60, 72, 84];
    
    return options.map(months => {
      const installmentValue = (totalValue * interestRate * Math.pow(1 + interestRate, months)) /
                              (Math.pow(1 + interestRate, months) - 1);
      return {
        parcelas: `${months}x de`,
        valor: formatCurrency(installmentValue),
        destaque: months === 84
      };
    });
  };

  if (showModal) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Dados para Proposta Comercial</h2>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.inputGroup}>
              <label htmlFor="customerName">Nome do Cliente *</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="energyBill">Valor da Conta de Energia *</label>
              <input
                type="text"
                id="energyBill"
                value={energyBillValue}
                onChange={handleEnergyBillChange}
                placeholder="R$ 0,00"
                required
              />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button 
              onClick={handleModalSubmit}
              className={styles.submitButton}
            >
              Gerar Proposta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return <div>Carregando...</div>;
  }

  const installmentOptions = generateInstallmentOptions(proposalData.estimatedProjectCost);

  return (
    <div className={styles.proposalContainer}>
      <div className={styles.proposalHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1>Soluções energéticas de confiança,</h1>
            <h2>com uma parceria para vida!</h2>
          </div>
          <div className={styles.headerLogo}>
            <img src="/logo.png" alt="Ecolote" className={styles.logoImage} />
          </div>
        </div>
      </div>

      <div className={styles.proposalBody}>
        <div className={styles.proposalInfo}>
          <div className={styles.infoLeft}>
            <h2>PROPOSTA COMERCIAL</h2>
            <p className={styles.customerName}>{customerName}</p>
          </div>
          <div className={styles.infoRight}>
            <p><strong>Número da Proposta:</strong> {proposalNumber}</p>
            <p><strong>Data da proposta:</strong> {getCurrentDate()}</p>
            <p><strong>Válida até {getValidityDate()}.</strong></p>
          </div>
        </div>

        <div className={styles.summarySection}>
          <h3>RESUMO FINANCEIRO DA PROPOSTA</h3>
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <p>Valor indicado da conta de luz</p>
                <h4>{formatCurrency(proposalData.monthlyBill)}</h4>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className={styles.cardContent}>
                <p>Sua economia em 25 anos</p>
                <h4>{formatCurrency(proposalData.savingsIn10Years * 2.5)}</h4>
              </div>
            </div>
          </div>
          
          <div className={styles.systemValueCard}>
            <h3>Valor do sistema instalado</h3>
            <div className={styles.mainValue}>{formatCurrency(proposalData.estimatedProjectCost)}</div>
            <p>à vista, com Pix, Boleto Bancário,</p>
            <p>ou em até 12 vezes de {formatCurrency(proposalData.estimatedProjectCost / 12)} no Cartão.</p>
          </div>
        </div>

        <div className={styles.financingSection}>
          <h3>FINANCIAMENTO DESCARBONIZE</h3>
          <p className={styles.financingDesc}>Parcelas fixas, com o pagamento da 1ª parcela em 4 meses.</p>
          
          <div className={styles.installmentsGrid}>
            {installmentOptions.map((option, index) => (
              <div key={index} className={`${styles.installmentCard} ${option.destaque ? styles.highlight : ''}`}>
                <div className={styles.installmentInfo}>
                  <span className={styles.installmentCount}>{option.parcelas}</span>
                  <span className={styles.installmentValue}>{option.valor}</span>
                </div>
                {option.destaque && (
                  <div className={styles.bestOption}>Melhor opção</div>
                )}
              </div>
            ))}
          </div>
          
          <p className={styles.financingNote}>Sujeito a aprovação de crédito. Outras opções de pagamento sob consulta.</p>
        </div>

        <div className={styles.whatsappSection}>
          <button className={styles.whatsappButton} onClick={handleWhatsAppClick}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
            </svg>
            <div>
              <span className={styles.whatsappTitle}>Esta proposta pode ser personalizada!</span>
              <span className={styles.whatsappSubtitle}>Solicite a um de nossos especialistas</span>
            </div>
          </button>
        </div>

        <div className={styles.benefitsSection}>
          <h3>PARA SEU BOLSO</h3>
          <div className={styles.benefitsContent}>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span>Instalação e Entrega sem custo adicional</span>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span>Redução de até 100% no consumo de energia</span>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span>Valorização do imóvel</span>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span>Até 20% de desconto no IPTU, em regiões que adotam o IPTU verde</span>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span>Crédito na conta de luz</span>
              </div>
            </div>
            <div className={styles.benefitsImage}>
              <div className={styles.solarHouse}></div>
            </div>
          </div>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <span className={styles.descText}>DESC</span>
              <span className={styles.arbonizeText}>ARBONIZE</span>
            </div>
            <div className={styles.footerContact}>
              <span className={styles.website}>www.descarbonizesolucoes.com.br</span>
              <div className={styles.phoneContact}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                <span>(44) 4090-2140</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialProposal;

