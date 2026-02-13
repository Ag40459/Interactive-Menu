import { useState, useCallback } from "react";

// Hook v3: Adicionado invTipoInvestidor como obrigatório
export const useInvestidorForm = () => {
  const [invNome, setInvNome] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invTelefone, setInvTelefone] = useState("");
  const [invTipoInvestidor, setInvTipoInvestidor] = useState(""); // Adicionado
  const [invCidade, setInvCidade] = useState("");
  const [invEstado, setInvEstado] = useState("");
  const [invValorInvestimento, setInvValorInvestimento] = useState("");


  const resetInvestidorForm = useCallback(() => {
    setInvNome(""); 
    setInvEmail("");
    setInvTelefone("");
    setInvTipoInvestidor(""); // Adicionado
    setInvCidade("");
    setInvEstado("");
    setInvValorInvestimento("");
    // setInvAreaInteresse("");
    // setInvMensagem("");
  }, []);

  const getValues = useCallback(() => ({
    nome: invNome,
    email: invEmail,
    telefone: invTelefone,
    tipo_investidor: invTipoInvestidor, // Adicionado e mapeado para o backend
    cidade: invCidade,
    estado: invEstado,
    valor_investimento: invValorInvestimento,
    // area_interesse_principal: invAreaInteresse, // Se o backend for atualizado
    // mensagem_investidor: invMensagem, // Se o backend for atualizado
  }), [
    invNome,
    invEmail,
    invTelefone,
    invTipoInvestidor, // Adicionado
    invCidade,
    invEstado,
    invValorInvestimento,
    // invAreaInteresse,
    // invMensagem,
  ]);

  return {
    invNome, setInvNome,
    invEmail, setInvEmail,
    invTelefone, setInvTelefone,
    invTipoInvestidor, setInvTipoInvestidor, // Adicionado
    invCidade, setInvCidade,
    invEstado, setInvEstado,
    invValorInvestimento, setInvValorInvestimento,
    // invAreaInteresse, setInvAreaInteresse,
    // invMensagem, setInvMensagem,
    resetInvestidorForm,
    getValues,
  };
};