import { createContext, useState, useEffect, useContext, useCallback } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "./AuthContext";

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
    // Estados principais
    const [leads, setLeads] = useState([]);
    const [availableLeads, setAvailableLeads] = useState([]);
    const [myLeads, setMyLeads] = useState([]);
    const [leadsToReactivate, setLeadsToReactivate] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    
    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        city: "",
        state: "",
        status: ""
    });

    // Estados de atendimento
    const [activeAttendance, setActiveAttendance] = useState(null);
    const [attendanceTimer, setAttendanceTimer] = useState(null);

    const { user } = useAuth(); 

    // Função para buscar leads disponíveis
    const fetchAvailableLeads = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get("/leads/available");
        const leadsData = response.data;
        
        setAvailableLeads(leadsData);
        setLeads(leadsData);
        
        return leadsData;
    } catch (err) {
        console.error("Erro ao buscar leads disponíveis:", err);
        setError(err.response?.data?.message || "Erro ao carregar leads disponíveis");
        return [];
    } finally {
        setLoading(false);
    }
    }, []);

     // Função para buscar leads com filtros
    const searchLeads = useCallback(async (searchParams = {}) => {
    try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('q', searchTerm);
        if (filters.type) params.append('type', filters.type);
        if (filters.city) params.append('city', filters.city);
        if (filters.state) params.append('state', filters.state);
        if (filters.status) params.append('status', filters.status);
        
        Object.keys(searchParams).forEach(key => {
            if (searchParams[key]) params.append(key, searchParams[key]);
        });
        
        const response = await apiClient.get(`/leads/search?${params.toString()}`);
        const searchResults = response.data;
        
        setLeads(searchResults);
        
        return searchResults;
    } catch (err) {
        console.error("Erro ao buscar leads:", err);
        setError(err.response?.data?.message || "Erro ao buscar leads");
        return [];
    } finally {
        setLoading(false);
    }
    }, [searchTerm, filters]);

    // Função para buscar meus leads
    const fetchMyLeads = useCallback(async () => {
        if (!user?.id) return [];
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get(`/leads/my-leads/${user.id}`);
            const myLeadsData = response.data;
            
            setMyLeads(myLeadsData);
            
            return myLeadsData;
        } catch (err) {
            console.error("Erro ao buscar meus leads:", err);
            setError(err.response?.data?.message || "Erro ao carregar meus leads");
            return [];
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Função para buscar leads para reativar
    const fetchLeadsToReactivate = useCallback(async () => {
        if (!user?.id) return [];
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get(`/leads/awaiting-reactivation/${user.id}`);
            const reactivationLeads = response.data;
            
            setLeadsToReactivate(reactivationLeads);
            
            return reactivationLeads;
        } catch (err) {
            console.error("Erro ao buscar leads para reativar:", err);
            setError(err.response?.data?.message || "Erro ao carregar leads para reativação");
            return [];
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Função para iniciar atendimento
    const startAttendance = useCallback(async (leadId) => {
        if (!user?.id) {
            setError("Usuário não autenticado");
            return { success: false, error: "Usuário não autenticado" };
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.post(`/leads/${leadId}/start-attendance`, {
                userId: user.id
            });
            
            const updatedLead = response.data.lead;
            
            // Atualiza o lead nas listas
            setLeads(prev => prev.map(lead => 
                lead.id === leadId ? updatedLead : lead
            ));
            setAvailableLeads(prev => prev.filter(lead => lead.id !== leadId));
            setMyLeads(prev => [...prev, updatedLead]);
            
            // Define atendimento ativo
            setActiveAttendance({
                leadId: leadId,
                startedAt: new Date(),
                userId: user.id
            });
            
            setSelectedLead(updatedLead);
            
            return { success: true, lead: updatedLead };
        } catch (err) {
            console.error("Erro ao iniciar atendimento:", err);
            const errorMessage = err.response?.data?.message || "Erro ao iniciar atendimento";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Função para encerrar atendimento
    const endAttendance = useCallback(async (leadId, attendanceDetails) => {
        if (!user?.id) {
            setError("Usuário não autenticado");
            return { success: false, error: "Usuário não autenticado" };
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.post(`/leads/${leadId}/end-attendance`, {
                userId: user.id,
                ...attendanceDetails
            });
            
            const updatedLead = response.data.lead;
            
            // Atualiza o lead nas listas
            setLeads(prev => prev.map(lead => 
                lead.id === leadId ? updatedLead : lead
            ));
            setMyLeads(prev => prev.map(lead => 
                lead.id === leadId ? updatedLead : lead
            ));
            
            // Remove atendimento ativo
            setActiveAttendance(null);
            if (attendanceTimer) {
                clearInterval(attendanceTimer);
                setAttendanceTimer(null);
            }
            
            return { success: true, lead: updatedLead };
        } catch (err) {
            console.error("Erro ao encerrar atendimento:", err);
            const errorMessage = err.response?.data?.message || "Erro ao encerrar atendimento";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [user?.id, attendanceTimer]);

    // Função para reativar lead
    const reactivateLeadById = useCallback(async (leadId, reactivationData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.post(`/leads/${leadId}/reactivate`, reactivationData);
            const updatedLead = response.data.lead;
            
            // Remove da lista de reativação e adiciona aos meus leads
            setLeadsToReactivate(prev => prev.filter(lead => lead.id !== leadId));
            setMyLeads(prev => [...prev, updatedLead]);
            
            return { success: true, lead: updatedLead };
        } catch (err) {
            console.error("Erro ao reativar lead:", err);
            const errorMessage = err.response?.data?.message || "Erro ao reativar lead";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para descartar lead
    const discardLead = useCallback(async (leadId, discardReason) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.post(`/leads/${leadId}/discard`, {
                discardReason
            });
            
            // Remove o lead de todas as listas
            setLeads(prev => prev.filter(lead => lead.id !== leadId));
            setAvailableLeads(prev => prev.filter(lead => lead.id !== leadId));
            setMyLeads(prev => prev.filter(lead => lead.id !== leadId));
            setLeadsToReactivate(prev => prev.filter(lead => lead.id !== leadId));
            
            return { success: true };
        } catch (err) {
            console.error("Erro ao descartar lead:", err);
            const errorMessage = err.response?.data?.message || "Erro ao descartar lead";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

       // Função para atualizar um lead específico
    const updateLead = useCallback((leadId, updatedData) => {
        setLeads(prev => prev.map(lead => 
            lead.id === leadId ? { ...lead, ...updatedData } : lead
        ));
        setAvailableLeads(prev => prev.map(lead => 
            lead.id === leadId ? { ...lead, ...updatedData } : lead
        ));
        setMyLeads(prev => prev.map(lead => 
            lead.id === leadId ? { ...lead, ...updatedData } : lead
        ));
        setLeadsToReactivate(prev => prev.map(lead => 
            lead.id === leadId ? { ...lead, ...updatedData } : lead
        ));
        
        if (selectedLead?.id === leadId) {
            setSelectedLead(prev => ({ ...prev, ...updatedData }));
        }
    }, [selectedLead?.id]);

    // Função para limpar erros
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Função para refresh geral
    const refreshLeads = useCallback(async () => {
        await Promise.all([
            fetchAvailableLeads(),
            fetchMyLeads(),
            fetchLeadsToReactivate()
        ]);
    }, [fetchAvailableLeads, fetchMyLeads, fetchLeadsToReactivate]);

    // Efeito para carregar dados iniciais
    useEffect(() => {
        if (user?.id) {
            refreshLeads();
        }
    }, [user?.id, refreshLeads]);

    // Efeito para polling de leads disponíveis (atualização em tempo real)
    useEffect(() => {
        if (!user?.id) return;

        const interval = setInterval(() => {
            fetchAvailableLeads();
        }, 30000); // Atualiza a cada 30 segundos

        return () => clearInterval(interval);
    }, [user?.id, fetchAvailableLeads]);

    const value = {
        // Estados
        leads,
        availableLeads,
        myLeads,
        leadsToReactivate,
        selectedLead,
        loading,
        error,
        searchTerm,
        filters,
        activeAttendance,
        
        // Setters
        setSelectedLead,
        setSearchTerm,
        setFilters,
        
        // Funções
        fetchAvailableLeads,
        fetchMyLeads,
        fetchLeadsToReactivate,
        startAttendance,
        endAttendance,
        reactivateLeadById,
        discardLead,
        searchLeads,
        updateLead,
        clearError,
        refreshLeads
    };

    return (
        <LeadContext.Provider value={value}>
            {children}
        </LeadContext.Provider>
    );
};

export const useLead = () => {
    const context = useContext(LeadContext);
    if (context === undefined) {
        throw new Error("useLead deve ser usado dentro de um LeadProvider");
    }
    return context;
};

