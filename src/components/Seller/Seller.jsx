import { useState, useEffect } from 'react';
import { useLead } from '../../contexts/LeadContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Seller.module.css';

const Seller = () => {
    const { user } = useAuth();
    const { 
        availableLeads, 
        myLeads, 
        leadsToReactivate, 
        loading, 
        error, 
        searchTerm, 
        setSearchTerm,
        filters,
        setFilters,
        fetchAvailableLeads,
        fetchMyLeads,
        fetchLeadsToReactivate,
        startAttendance,
        clearError
    } = useLead();

    const [activeTab, setActiveTab] = useState('available');
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchAvailableLeads();
            fetchMyLeads();
            fetchLeadsToReactivate();
        }
    }, [user?.id]);

    const handleStartAttendance = async (leadId) => {
        const result = await startAttendance(leadId);
        if (result.success) {
            setSelectedLead(result.lead);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        clearError();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getLeadsByTab = () => {
        switch (activeTab) {
            case 'available':
                return availableLeads;
            case 'myLeads':
                return myLeads;
            case 'reactivation':
                return leadsToReactivate;
            default:
                return [];
        }
    };

    const renderLeadCard = (lead) => (
        <div key={lead.id} className={styles.leadCard}>
            <div className={styles.leadHeader}>
                <h3 className={styles.leadTitle}>
                    {lead.nome_empreendimento || 'Empreendimento não informado'}
                </h3>
                <div className={styles.leadDate}>
                    {formatDate(lead.created_at)} • {lead.tipo_cliente}
                </div>
                <div className={styles.leadLocation}>
                    {lead.cidade} • {lead.estado}
                </div>
            </div>

            <div className={styles.leadStatus}>
                <span className={`${styles.statusBadge} ${styles[lead.status?.toLowerCase().replace(/\s+/g, '_')]}`}>
                    {lead.status || 'Novo contato'}
                </span>
            </div>

            {activeTab === 'available' && (
                <div className={styles.leadActions}>
                    <button 
                        className={styles.startAttendanceBtn}
                        onClick={() => handleStartAttendance(lead.id)}
                        disabled={loading}
                    >
                        Iniciar atendimento
                    </button>
                </div>
            )}

            {activeTab === 'myLeads' && (
                <div className={styles.leadInfo}>
                    <div className={styles.attendanceInfo}>
                        {lead.is_active_attendance ? (
                            <span className={styles.activeAttendance}>
                                Em atendimento
                            </span>
                        ) : (
                            <span className={styles.inactiveAttendance}>
                                Atendimento encerrado
                            </span>
                        )}
                    </div>
                    {lead.last_interaction_at && (
                        <div className={styles.lastInteraction}>
                            Última interação: {formatDate(lead.last_interaction_at)}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reactivation' && (
                <div className={styles.reactivationInfo}>
                    <div className={styles.reactivationDate}>
                        Prazo: {formatDate(lead.reactivation_due_date)}
                    </div>
                    <div className={styles.reactivationActions}>
                        <button className={styles.reactivateBtn}>
                            Pedir novo prazo
                        </button>
                        <button className={styles.discardBtn}>
                            Descartar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading && getLeadsByTab().length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando leads...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🌱</span>
                        <span className={styles.logoText}>EcoLote</span>
                    </div>
                    <div className={styles.userProfile}>
                        <div className={styles.userAvatar}>
                            {user?.nome_completo?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search term"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTab} ${activeTab === 'available' ? styles.active : ''}`}
                        onClick={() => handleTabChange('available')}
                    >
                        Leads em aberto
                    </button>
                    <button
                        className={`${styles.filterTab} ${activeTab === 'myLeads' ? styles.active : ''}`}
                        onClick={() => handleTabChange('myLeads')}
                    >
                        Meus leads
                    </button>
                    <button
                        className={`${styles.filterTab} ${activeTab === 'reactivation' ? styles.active : ''}`}
                        onClick={() => handleTabChange('reactivation')}
                    >
                        Para reativar
                    </button>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                    <button onClick={clearError} className={styles.closeError}>×</button>
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.leadsContainer}>
                    {getLeadsByTab().length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📋</div>
                            <h3>Nenhum lead encontrado</h3>
                            <p>
                                {activeTab === 'available' && 'Não há leads disponíveis no momento.'}
                                {activeTab === 'myLeads' && 'Você ainda não possui leads atribuídos.'}
                                {activeTab === 'reactivation' && 'Não há leads aguardando reativação.'}
                            </p>
                        </div>
                    ) : (
                        getLeadsByTab().map(renderLeadCard)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seller;

