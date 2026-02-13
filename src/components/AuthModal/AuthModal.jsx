import React, { useState, useEffect } from "react";
import styles from "./AuthModal.module.css";
import LoginPageContent from "../Admin/LoginPageContent"; // Será criado/adaptado depois
import AdminRegisterPageContent from "../Admin/AdminRegisterPageContent"; // Será criado/adaptado depois

const AuthModal = ({ isOpen, onClose }) => {
    const [currentView, setCurrentView] = useState("login"); // 'login' or 'register'

    useEffect(() => {
        // Reset view to login when modal is reopened
        if (isOpen) {
            setCurrentView("login");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const switchToRegister = () => setCurrentView("register");
    const switchToLogin = () => setCurrentView("login");

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                {
                    currentView === "login" ? (
                        <LoginPageContent switchToRegister={switchToRegister} onClose={onClose} />
                    ) : (
                        <AdminRegisterPageContent switchToLogin={switchToLogin} />
                    )
                }
            </div>
        </div>
    );
};

export default AuthModal;
