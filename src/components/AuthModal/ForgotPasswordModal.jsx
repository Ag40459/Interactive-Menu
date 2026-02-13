import React, { useState } from "react";
import apiClient from "../../services/apiClient"; // Presumindo que apiClient está configurado
import modalStyles from "./AuthModal.module.css"; // Reutilizando estilos do AuthModal ou crie um específico

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // Para mensagens de sucesso ou erro
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            // A rota /api/admin/request-password-reset será criada no backend
            const response = await apiClient.post("/api/admin/request-password-reset", { email });
            
            // Assumindo que o backend responde com { emailExists: true/false, message: "..." }
            if (response.data.emailExists) {
                setMessage("Se o email estiver cadastrado, um link para redefinição de senha foi enviado.");
                setIsError(false);
                setEmail(""); // Limpar campo após sucesso
                // Opcionalmente, fechar o modal após um tempo ou deixar o usuário fechar
                // setTimeout(() => onClose(), 3000);
            } else {
                setMessage(response.data.message || "Email não encontrado em nossa base de dados.");
                setIsError(true);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Ocorreu um erro ao processar sua solicitação. Tente novamente.");
            setIsError(true);
            console.error("Erro na solicitação de redefinição de senha:", err);
        }
        setLoading(false);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={modalStyles.modalOverlay} onClick={onClose}>
            <div className={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={modalStyles.closeButton} onClick={onClose}>X</button>
                <h2>Esqueci Minha Senha</h2>
                <p style={{ marginBottom: "20px", fontSize: "0.9rem", color: "#555" }}>
                    Por favor, insira o seu endereço de email cadastrado. Se encontrarmos uma conta associada a este email, enviaremos um link para você redefinir sua senha.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className={modalStyles.formGroup}>
                        <label htmlFor="forgot-email">Email:</label>
                        <input
                            type="email"
                            id="forgot-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seuemail@ecolote.com.br"
                        />
                    </div>
                    {message && (
                        <p className={isError ? modalStyles.errorMessage : modalStyles.successMessage}
                           style={{ marginTop: "15px", textAlign: "center" }}>
                            {message}
                        </p>
                    )}
                    <button 
                        type="submit" 
                        className={modalStyles.submitButton} 
                        disabled={loading}
                        style={{ marginTop: "10px" }}
                    >
                        {loading ? "Enviando..." : "Enviar Link de Redefinição"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;

