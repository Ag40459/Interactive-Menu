import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import modalStyles from "../AuthModal/AuthModal.module.css"; // Usando estilos do modal
import ForgotPasswordModal from "../AuthModal/ForgotPasswordModal"; // Importar o novo modal

const LoginPageContent = ({ switchToRegister, onClose }) => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await login(email, senha);
            if (result.success) {
                if (onClose) onClose();
                navigate('/admin/dashboard');
            } else {
                setError(result.error || "Falha no login. Verifique suas credenciais.");
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar fazer login.");
            console.error("Erro no handleSubmit do Login:", err);
        }
        setLoading(false);
    };

    const openForgotPasswordModal = () => {
        setIsForgotPasswordModalOpen(true);
    };

    const closeForgotPasswordModal = () => {
        setIsForgotPasswordModalOpen(false);
    };

    return (
        <>
            <h2>Login de Administrador</h2>
            <form onSubmit={handleSubmit}>
                <div className={modalStyles.formGroup}>
                    <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seuemail@gmail.com"
                    />
                </div>
                <div className={modalStyles.formGroup}>
                    <input
                        type="password"
                        id="login-senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="Senha"

                    />
                </div>
                <span className={modalStyles.forgotPasswordLink} onClick={openForgotPasswordModal}>
                    Esqueci minha senha
                </span>
                {error && <p className={modalStyles.errorMessage}>{error}</p>}
                <button type="submit" className={modalStyles.submitButton} disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
            <p className={modalStyles.authLink}>
                Não tem uma conta? <span onClick={switchToRegister}>Cadastre-se</span>
            </p>

            <ForgotPasswordModal 
                isOpen={isForgotPasswordModalOpen} 
                onClose={closeForgotPasswordModal} 
            />
        </>
    );
};

export default LoginPageContent;

