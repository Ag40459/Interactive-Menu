import React, { createContext, useState, useEffect, useContext } from "react";
import apiClient from "../services/apiClient"; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true); // Para verificar o estado inicial de autenticação

    useEffect(() => {
        // Tenta carregar o admin e o token do localStorage ao iniciar
        const storedToken = localStorage.getItem("adminAuthToken");
        const storedAdmin = localStorage.getItem("adminDetails");

        if (storedToken && storedAdmin) {
            try {
                const adminDetails = JSON.parse(storedAdmin);
                setAdmin(adminDetails);
                // Configura o token no apiClient para requisições futuras
                // O interceptor do apiClient já deve fazer isso, mas podemos garantir aqui também
                apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            } catch (error) {
                console.error("Erro ao parsear adminDetails do localStorage:", error);
                localStorage.removeItem("adminAuthToken");
                localStorage.removeItem("adminDetails");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, senha) => {
        try {
            const response = await apiClient.post("/admin/login", { email, senha });
            const { token, admin: adminData } = response.data;

            localStorage.setItem("adminAuthToken", token);
            localStorage.setItem("adminDetails", JSON.stringify(adminData));
            setAdmin(adminData);
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return { success: true, data: adminData };
        } catch (error) {
            console.error("Erro no login:", error.response ? error.response.data : error.message);
            // Limpa qualquer estado de login anterior em caso de falha
            localStorage.removeItem("adminAuthToken");
            localStorage.removeItem("adminDetails");
            setAdmin(null);
            delete apiClient.defaults.headers.common["Authorization"];
            return { success: false, error: error.response?.data?.message || "Falha no login." };
        }
    };

    const logout = () => {
        localStorage.removeItem("adminAuthToken");
        localStorage.removeItem("adminDetails");
        setAdmin(null);
        delete apiClient.defaults.headers.common["Authorization"];
    };

    // Poderíamos adicionar uma função para registrar admin aqui também, se necessário
    // const registerAdmin = async (nome_completo, email, senha) => { ... };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};

