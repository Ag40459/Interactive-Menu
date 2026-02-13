import { useState, useEffect } from 'react';
import styles from './SimulationModal.module.css';
import { solarCalculator,  formatCurrency } from '../../utils/calc';
import { formatPhone, formatCep } from '../../utils/formatters';
import { fetchCepData } from '../../utils/cepService';
import apiClient from '../../services/apiClient';
import VerificationCodeModal from '../ContactModal/VerificationCodeModal';
import SimulationForm from './SimulationForm';
import SimulationResults from './SimulationResults';

const PaymentIntentionModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const options = [
    { value: "avista", label: "À vista", order: 1  },
    { value: "financiado", label: "Financiado", order: 2 },
    { value: "cartao", label: "Cartão", order: 3 }
  ];

  return (
    <div className={styles.intentionModalOverlay}>
      <div className={styles.intentionModalContainer}>
        <button 
          className={styles.modalCloseButton} 
          onClick={onClose}
          aria-label="Fechar modal"
        >×</button>
        <h3 className={styles.intentionModalTitle}>Pretensão de Pagamento</h3>
        <p className={styles.intentionModalSubtitle}>
          Pretenção de pagamento?
        </p>
        <div className={styles.intentionOptions}>
          {options.map(option => (
            <button 
              key={option.value}
              className={styles.intentionOption}
              onClick={() => onSelect(option.value)}
              style={{"--animation-order": option.order}}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SimulationModal = ({ initialValue, onClose }) => {
  // Estados do formulário
  const [step, setStep] = useState('form'); // 'form' ou 'results'
  const [billValue, setBillValue] = useState(initialValue || 200);
  const [formattedBillValue, setFormattedBillValue] = useState('');
  const [profileType, setProfileType] = useState('pessoal');
  const [cep, setCep] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    logradouro: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [paymentIntention, setPaymentIntention] = useState('');
  
  // Novos estados para PJ (Adicionados)
  const [cnpj, setCnpj] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");

  // Estados para modais
  const [isPaymentIntentionModalOpen, setIsPaymentIntentionModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Estado para armazenar resultados da simulação
  const [results, setResults] = useState(null);

  // Formatar o valor inicial
  useEffect(() => {
    setFormattedBillValue(formatCurrency(billValue.toString(), 'input'));
  }, [billValue]);

  // Função para buscar dados do CEP
  const handleCepChange = async (e) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
    
    if (formattedCep.replace(/\D/g, '').length === 8) {
      setLoadingCep(true);
      setCepError('');
      
      try {
        const data = await fetchCepData(formattedCep);
        setAddress({
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        });
      } catch (error) {
        setCepError(error.message || 'Erro ao buscar CEP');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  // Função para lidar com o envio do formulário (cálculo)
  const handleSubmit = (billValueFromForm) => {
    const specifications = solarCalculator({ monthlyBill: billValueFromForm });
    setResults(specifications);
    setStep('results');
  };

  // Função para iniciar o pré-cadastro
  const handlePreRegister = () => {
    setIsPaymentIntentionModalOpen(true);
  };

  // Função para processar a seleção de pretensão de pagamento
  const handlePaymentIntentionSelect = async (intention) => {
    setPaymentIntention(intention);
    setIsPaymentIntentionModalOpen(false);
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await apiClient.post('/verificacao/enviar-codigo', { email });
      setIsVerificationModalOpen(true);
    } catch (error) {
      console.error("Erro ao iniciar verificação:", error);
      setSubmitError(error.response?.data?.message || "Não foi possível iniciar a verificação. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para verificar o código e enviar dados
  const handleVerifyCode = async (code) => {
    try {
      await apiClient.post('/verificacao/validar-codigo', {
        email: email,
        codigo: code
      });
      
      let endpoint = '';
      let payload = {};
      
      if (profileType === 'pessoal') {
        endpoint = '/pessoas-fisicas';
        payload = {
          nome_completo: name,
          telefone: phone,
          email: email,
          modelo_imovel: 'Casa', // Valor padrão
          media_conta_energia: billValue.toString(),
          cep: cep,
          rua: address.logradouro,
          numero: 'S/N', // Correção aplicada
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado,
          pretensao_pagamento: paymentIntention
        };
      } else if (profileType === 'empresa') {
        endpoint = '/pessoas-juridicas';
        payload = {
          razao_social: name, 
          cnpj: cnpj, // Incluído
          telefone_comercial: phone, 
          email_comercial: email,
          nome_responsavel: nomeResponsavel, // Incluído
          telefone_responsavel: telefoneResponsavel, // Incluído
          tipo_imovel_comercial: 'Comercial', // Valor padrão
          media_conta_energia_pj: billValue.toString(), // Garantir string
          cep_pj: cep,
          rua_pj: address.logradouro,
          numero_pj: 'S/N', // Incluído valor fixo
          bairro_pj: address.bairro,
          cidade_pj: address.cidade,
          estado_pj: address.estado,
          pretensao_pagamento_pj: paymentIntention
        };
      } else if (profileType === 'investidor') {
        // Payload do Investidor restaurado ao original do arquivo lido
        endpoint = '/investidores';
        payload = {
          nome: name,
          email: email,
          telefone: phone,
          cidade: address.cidade,
          estado: address.estado,
          valor_investimento: billValue.toString(),
          tipo_investidor: 'Pessoa Física' // Valor padrão original
        };
      }
      
      const response = await apiClient.post(endpoint, payload);
      setIsVerificationModalOpen(false);
      onClose();
      alert('Pré-cadastro realizado com sucesso!');
      
    } catch (error) {
      console.error("Erro na verificação ou envio:", error);
      const errorMessage = error.response?.data?.message || "Código inválido ou erro ao salvar os dados. Por favor, tente novamente.";
      throw new Error(errorMessage);
    }
  };

  // Função para reenviar o código
  const handleResendCode = async () => {
    try {
      await apiClient.post('/verificacao/enviar-codigo', { email });
      console.log("Código reenviado para:", email);
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
    }
  };

  // Renderiza o modal de verificação de código
  const renderVerificationModal = () => (
    <VerificationCodeModal
      isOpen={isVerificationModalOpen}
      onClose={() => setIsVerificationModalOpen(false)}
      onVerify={handleVerifyCode}
      onResend={handleResendCode}
      email={email}
    />
  );

  // Renderiza o modal de pretensão de pagamento
  const renderPaymentIntentionModal = () => (
    <PaymentIntentionModal
      isOpen={isPaymentIntentionModalOpen}
      onClose={() => setIsPaymentIntentionModalOpen(false)}
      onSelect={handlePaymentIntentionSelect}
    />
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {step === 'form' ? (
          <SimulationForm 
            initialValue={billValue}
            profileType={profileType}
            cep={cep}
            name={name}
            email={email}
            phone={phone}
            address={address}
            loadingCep={loadingCep}
            cepError={cepError}
            onSubmit={handleSubmit} 
            onClose={onClose}
            onProfileTypeChange={(type) => setProfileType(type)}
            onCepChange={handleCepChange}
            onNameChange={(e) => setName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPhoneChange={(e) => setPhone(formatPhone(e.target.value))} 
            // Passa novos estados e setters para PJ (Adicionado)
            cnpj={cnpj}
            nomeResponsavel={nomeResponsavel}
            telefoneResponsavel={telefoneResponsavel}
            onCnpjChange={(e) => setCnpj(e.target.value)} 
            onNomeResponsavelChange={(e) => setNomeResponsavel(e.target.value)}
            onTelefoneResponsavelChange={(e) => setTelefoneResponsavel(formatPhone(e.target.value))} 
            // Passa o setter para o valor da conta
            onBillValueChange={setBillValue} 
          />
        ) : (
          <SimulationResults 
            results={results}
            onPreRegister={handlePreRegister}
            onClose={onClose}
          />
        )}
        {renderVerificationModal()}
        {renderPaymentIntentionModal()}
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}
      </div>
    </div>
  );
};

export default SimulationModal;
