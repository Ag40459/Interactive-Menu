import React, { useState } from "react";
import apiClient from "../../services/apiClient";
import modalStyles from "../AuthModal/AuthModal.module.css"; // Usando estilos do modal

const AdminRegisterPageContent = ({ switchToLogin, onClose }) => {
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (senha !== confirmaSenha) {
            setError("As senhas não coincidem.");
            return;
        }
        if (!email.endsWith("@ecolote.com.br")) {
            setError("O email do administrador deve ser do domínio @ecolote.com.br.");
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post("/admin/register", {
                nome_completo: nomeCompleto,
                email,
                senha,
            });
            setSuccessMessage(response.data.message || "Administrador cadastrado com sucesso! Agora você pode fazer login.");
            setNomeCompleto("");
            setEmail("");
            setSenha("");
            setConfirmaSenha("");
            // Opcionalmente, pode chamar switchToLogin() automaticamente após um tempo
            // ou deixar que o usuário clique no link.
            // if (onClose) onClose(); // Poderia fechar o modal ou ir para login
        } catch (err) {
            setError(err.response?.data?.message || "Falha ao cadastrar administrador.");
            console.error("Erro no cadastro de Admin:", err);
        }
        setLoading(false);
    };

    return (
        <>
            <h2>Cadastrar Novo Administrador</h2>
            <form onSubmit={handleSubmit}>
                <div className={modalStyles.formGroup}>
                    <label htmlFor="reg-nomeCompleto">Nome:</label>
                    <input
                        type="text"
                        id="reg-nomeCompleto"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        required
                    />
                </div>
                <div className={modalStyles.formGroup}>
                    <label htmlFor="reg-email">Email:</label>
                    <input
                        type="email"
                        id="reg-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="novo_admin@ecolote.com.br"
                    />
                </div>
                <div className={modalStyles.formGroup}>
                    <label htmlFor="reg-senha">Senha:</label>
                    <input
                        type="password"
                        id="reg-senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div className={modalStyles.formGroup}>
                    <label htmlFor="reg-confirmaSenha">Confirmar Senha:</label>
                    <input
                        type="password"
                        id="reg-confirmaSenha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                    />
                </div>
                {error && <p className={modalStyles.errorMessage}>{error}</p>}
                {successMessage && <p className={modalStyles.successMessage}>{successMessage}</p>}
                <button type="submit" className={modalStyles.submitButton} disabled={loading}>
                    {loading ? "Cadastrando..." : "Cadastrar Administrador"}
                </button>
            </form>
            <p className={modalStyles.authLink}>
                Já possui uma conta? <span onClick={switchToLogin}>Faça login</span>
            </p>
        </>
    );
};

export default AdminRegisterPageContent;

