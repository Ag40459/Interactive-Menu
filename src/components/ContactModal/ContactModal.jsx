import { useState, useEffect, useCallback } from "react";
import styles from "./ContactModal.module.css";
import { fetchCepData } from "../../utils/cepService";
import apiClient from "../../services/apiClient";
import PessoaFisicaForm from "./PessoaFisicaForm";
import PessoaJuridicaForm from "./PessoaJuridicaForm";
import InvestidorForm from "./InvestidorForm";
import VerificationCodeModal from "./VerificationCodeModal";
import { useInvestidorForm } from "../../hooks/useInvestidorForm";

const ContactModal = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [tempFormData, setTempFormData] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [currentFormSubmit, setCurrentFormSubmit] = useState(null);
  const [currentFormData, setCurrentFormData] = useState(null);
  const investidorForm = useInvestidorForm();

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setModalStep(2);
    setSubmitSuccessMessage("");
    setSubmitErrorMessage("");
    setTempFormData(null);
    setVerificationEmail("");
    setCurrentFormSubmit(null);
    setCurrentFormData(null);
  };

  const handleBack = () => {
    if (selectedType === "investidor") {
      investidorForm.resetInvestidorForm();
    }
    setModalStep(1);
    setSubmitSuccessMessage("");
    setSubmitErrorMessage("");
    setCurrentFormSubmit(null);
    setCurrentFormData(null);
  };

  const onFormSubmitReady = useCallback((submitFn) => {
    setCurrentFormSubmit(() => submitFn);
  }, []);

  const onFormSubmitData = useCallback((data) => {
    setCurrentFormData(data);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccessMessage("");
    setSubmitErrorMessage("");

    if (currentFormSubmit) {
      try {
        await currentFormSubmit();
      } catch (error) {
        console.error("Erro na validação do formulário filho:", error);
        setSubmitErrorMessage("Erro na validação do formulário. Verifique os campos.");
        setIsSubmitting(false);
      }
    } else {
      setSubmitErrorMessage("Nenhum formulário pronto para ser enviado.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const processFormData = async () => {
      if (!currentFormData) return;

      let endpoint = "";
      let email = "";

      if (selectedType === "pessoa física") {
        endpoint = "/pessoas-fisicas";
        email = currentFormData.pfEmail;
      } else if (selectedType === "pessoa jurídica") {
        endpoint = "/pessoas-juridicas";
        email = currentFormData.pjEmailComercial;
      } else if (selectedType === "investidor") {
        endpoint = "/investidores";
        email = currentFormData.invEmail;
      }

      if (endpoint && email) {
        try {
          setTempFormData({ endpoint, payload: currentFormData });
          setVerificationEmail(email);
          await apiClient.post("/verificacao/enviar-codigo", { email });
          setIsVerificationModalOpen(true);
        } catch (error) {
          console.error("Erro ao iniciar verificação:", error);
          if (error.response && error.response.data && error.response.data.message) {
            setSubmitErrorMessage(error.response.data.message);
          } else {
            setSubmitErrorMessage("Não foi possível iniciar a verificação. Tente novamente mais tarde.");
          }
          setIsSubmitting(false);
        }
      } else {
        setSubmitErrorMessage("Dados do formulário incompletos para envio.");
        setIsSubmitting(false);
      }
    };

    if (currentFormData) {
      processFormData();
    }
  }, [currentFormData, selectedType]);

  const handleVerifyCode = async (code) => {
    if (!tempFormData) {
      throw new Error("Dados do formulário não encontrados");
    }
    try {
      await apiClient.post("/verificacao/validar-codigo", {
        email: verificationEmail,
        codigo: code
      });

      const response = await apiClient.post(tempFormData.endpoint, tempFormData.payload);

      setIsVerificationModalOpen(false);
      setSubmitSuccessMessage(response.data.message || "Dados enviados com sucesso!");

      setTempFormData(null);
      setVerificationEmail("");
      setCurrentFormData(null);
      setIsSubmitting(false);

      setTimeout(() => {
        if (selectedType === "investidor") {
          investidorForm.resetInvestidorForm();
        }
        setModalStep(1);
        onClose();
        setSelectedType("");
      }, 3000);

    } catch (error) {
      console.error("Erro na verificação:", error);
      throw new Error(
        error.response?.data?.message || "Código inválido. Por favor, tente novamente."
      );
    }
  };

  const handleResendCode = async () => {
    try {
      await apiClient.post("/verificacao/enviar-codigo", { email: verificationEmail });
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const renderForm = () => {
    if (selectedType === "pessoa física") {
      return <PessoaFisicaForm onFormSubmitReady={onFormSubmitReady} onFormSubmitData={onFormSubmitData} loadingCep={loadingCep} cepError={cepError} setLoadingCep={setLoadingCep} setCepError={setCepError} />;
    }
    if (selectedType === "pessoa jurídica") {
      return <PessoaJuridicaForm onFormSubmitReady={onFormSubmitReady} onFormSubmitData={onFormSubmitData} loadingCep={loadingCep} cepError={cepError} setLoadingCep={setLoadingCep} setCepError={setCepError} />;
    }
    if (selectedType === "investidor") {
      return (
        <InvestidorForm
          form={investidorForm}
          onFormSubmitReady={onFormSubmitReady}
          onFormSubmitData={onFormSubmitData}
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={() => {
            if (selectedType === "investidor") {
              investidorForm.resetInvestidorForm();
            }
            setModalStep(1);
            onClose();
            setSelectedType("");
            setSubmitSuccessMessage("");
            setSubmitErrorMessage("");
            setCurrentFormSubmit(null);
            setCurrentFormData(null);
          }}
        >
          &times;
        </button>

        {modalStep === 1 && (
          <div className={styles.typeSelectionContainer}>
            <h2>Como Deseja Participar do Ecolote?</h2>
            <button onClick={() => handleTypeSelect("pessoa física")} className={styles.typeButton}>
              Pessoa Física
            </button>
            <button onClick={() => handleTypeSelect("pessoa jurídica")} className={styles.typeButton}>
              Pessoa Jurídica
            </button>
            <button onClick={() => handleTypeSelect("investidor")} className={styles.typeButton}>
              Investidor
            </button>
          </div>
        )}

        {modalStep === 2 && (
          <form onSubmit={handleSubmit} className={styles.contactForm}>
            <button type="button" onClick={handleBack} className={styles.backButton} disabled={isSubmitting}>
              &larr; Voltar
            </button>
            <h2>Contato - {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</h2>
            {renderForm()}
            {submitSuccessMessage && <p className={styles.successMessage}>{submitSuccessMessage}</p>}
            {submitErrorMessage && <p className={styles.errorMessage}>{submitErrorMessage}</p>}
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        )}
      </div>

      <VerificationCodeModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerifyCode}
        onResendCode={handleResendCode}
        email={verificationEmail}
      />
    </div>
  );
};

export default ContactModal;
