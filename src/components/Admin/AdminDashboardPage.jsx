import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import apiClient from "../../services/apiClient";
import styles from "./AdminPages.module.css";

const AdminDashboardPage = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [pessoasFisicas, setPessoasFisicas] = useState([]);
    const [pessoasJuridicas, setPessoasJuridicas] = useState([]);
    const [investidores, setInvestidores] = useState([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTermPf, setSearchTermPf] = useState("");
    const [sortConfigPf, setSortConfigPf] = useState({ key: "created_at", direction: "descending" });

    const [searchTermPj, setSearchTermPj] = useState("");
    const [sortConfigPj, setSortConfigPj] = useState({ key: "created_at", direction: "descending" });

    const [searchTermInv, setSearchTermInv] = useState("");
    const [sortConfigInv, setSortConfigInv] = useState({ key: "created_at", direction: "descending" });

    const generateUniqueIdentifier = () => {
        const stored = localStorage.getItem('ecolote_visitor_id');
        if (stored) {
            return stored;
        }
        
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        const identifier = `visitor_${timestamp}_${random}`;
        
        localStorage.setItem('ecolote_visitor_id', identifier);
        return identifier;
    };

    const recordVisit = async () => {
        try {
            const uniqueIdentifier = generateUniqueIdentifier();
            await apiClient.post("/visits/record", { uniqueIdentifier });
        } catch (err) {
            console.error("Erro ao registrar visita:", err);
        }
    };

    const fetchTotalVisits = async () => {
        try {
            const response = await apiClient.get("/visits/total");
            setTotalVisits(response.data.totalVisits);
        } catch (err) {
            console.error("Erro ao buscar total de visitas:", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const [pfRes, pjRes, invRes] = await Promise.all([
                    apiClient.get("/admin/data/pessoas-fisicas"),
                    apiClient.get("/admin/data/pessoas-juridicas"),
                    apiClient.get("/admin/data/investidores"),
                ]);
                setPessoasFisicas(pfRes.data);
                setPessoasJuridicas(pjRes.data);
                setInvestidores(invRes.data);
            } catch (err) {
                console.error("Erro ao buscar dados para o dashboard:", err);
                setError("Falha ao carregar os dados. Verifique sua conexão ou tente novamente mais tarde.");
                if (err.response && err.response.status === 401) {
                    logout();
                }
            }
            setLoading(false);
        };

        if (admin) {
            fetchData();
            recordVisit();
            fetchTotalVisits();
        }
    }, [admin, logout]);

    const handleSort = (tableType, key) => {
        let direction = "ascending";
        let setSortConfig;
        let currentSortConfig;

        if (tableType === "pf") {
            setSortConfig = setSortConfigPf;
            currentSortConfig = sortConfigPf;
        } else if (tableType === "pj") {
            setSortConfig = setSortConfigPj;
            currentSortConfig = sortConfigPj;
        } else {
            setSortConfig = setSortConfigInv;
            currentSortConfig = sortConfigInv;
        }

        if (currentSortConfig.key === key && currentSortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredData = (data, searchTerm, sortConfig, searchKeys) => {
        let filteredData = [...data];
        if (searchTerm) {
            filteredData = filteredData.filter(item =>
                searchKeys.some(key =>
                    item[key] && String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    };

    const pfSearchKeys = ["nome_completo", "email", "telefone", "cidade", "estado"];
    const pjSearchKeys = ["nome_empresa", "cnpj", "telefone", "cidade", "estado"];
    const invSearchKeys = ["nome", "email", "telefone", "cidade", "estado"];

    const processedPessoasFisicas = useMemo(() => sortedAndFilteredData(pessoasFisicas, searchTermPf, sortConfigPf, pfSearchKeys), [pessoasFisicas, searchTermPf, sortConfigPf]);
    const processedPessoasJuridicas = useMemo(() => sortedAndFilteredData(pessoasJuridicas, searchTermPj, sortConfigPj, pjSearchKeys), [pessoasJuridicas, searchTermPj, sortConfigPj]);
    const processedInvestidores = useMemo(() => sortedAndFilteredData(investidores, searchTermInv, sortConfigInv, invSearchKeys), [investidores, searchTermInv, sortConfigInv]);

    const renderTable = (title, data, columns, tableType, searchTerm, setSearchTerm, currentSortConfig) => {
        if (loading) return <p className={styles.loadingMessageDashboard}>Carregando dados de {title.toLowerCase()}...</p>;
        
        return (
            <div className={styles.dataSection}>
                <div className={styles.tableHeaderControls}>
                    <h2>{title}</h2>
                    <input 
                        type="text"
                        placeholder={`Buscar em ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInputTable}
                    />
                </div>
                {data.length === 0 && !loading && <p className={styles.noDataMessage}>Nenhum dado encontrado para {title.toLowerCase()} {searchTerm && "com o termo buscado"}.</p>}
                {data.length > 0 && (
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} onClick={() => handleSort(tableType, col.key)} className={styles.sortableHeader}>
                                        {col.header}
                                        {currentSortConfig.key === col.key && (
                                            <span>{currentSortConfig.direction === "ascending" ? " \u25B2" : " \u25BC"}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id || index}>
                                    {columns.map(col => <td key={col.key}>{item[col.key] !== null && item[col.key] !== undefined ? String(item[col.key]) : "-"}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    const pfColumns = [
        { key: "nome_completo", header: "Nome" },
        { key: "telefone", header: "Telefone" },
        { key: "email", header: "Email" }, 
        { key: "modelo_imovel", header: "Modelo Imóvel" },
        { key: "media_conta_energia", header: "Média Conta" },
        { key: "cidade", header: "Cidade" },
        { key: "estado", header: "Estado" },
        { key: "pretensao_pagamento", header: "Pretensão Pag." },
        { key: "created_at", header: "Data Envio" },
    ];

    const pjColumns = [
        { key: "nome_empresa", header: "Empresa" },
        { key: "cnpj", header: "CNPJ" },
        { key: "telefone", header: "Telefone" },
        { key: "modelo_imovel", header: "Modelo Imóvel" },
        { key: "media_conta_energia", header: "Média Conta" },
        { key: "cidade", header: "Cidade" },
        { key: "estado", header: "Estado" },
        { key: "pretensao_pagamento", header: "Pretensão Pag." },
        { key: "created_at", header: "Data Envio" },
    ];

    const invColumns = [
        { key: "nome", header: "Nome" },
        { key: "email", header: "Email" },
        { key: "telefone", header: "Telefone" },
        { key: "cidade", header: "Cidade" },
        { key: "estado", header: "Estado" },
        { key: "valor_investimento", header: "Valor Investimento" },
        { key: "created_at", header: "Data Envio" },
    ];

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <h1>Dashboard Administrativo</h1>
                <button onClick={() => navigate(-1)} className={styles.backButton}>Voltar</button>
                <div className={styles.headerInfo}>
                    {admin && (
                        <div>
                            <span>Olá, {admin.nome_completo}!</span>
                            <button onClick={logout} className={styles.logoutButton} style={{ marginLeft: "15px" }}>Sair</button>
                        </div>
                    )}
                    <div className={styles.visitCounter}>
                        <span className={styles.visitCounterLabel}>Visitas Únicas:</span>
                        <span className={styles.visitCounterValue}>{totalVisits.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {error && <p className={styles.errorMessageDashboard}>{error}</p>}

            {renderTable("Pessoas Físicas", processedPessoasFisicas, pfColumns, "pf", searchTermPf, setSearchTermPf, sortConfigPf)}
            {renderTable("Pessoas Jurídicas", processedPessoasJuridicas, pjColumns, "pj", searchTermPj, setSearchTermPj, sortConfigPj)}
            {renderTable("Investidores", processedInvestidores, invColumns, "inv", searchTermInv, setSearchTermInv, sortConfigInv)}
        </div>
    );
};

export default AdminDashboardPage;

