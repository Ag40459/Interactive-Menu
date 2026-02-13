import { useState, useCallback } from "react";

export const usePessoaJuridicaForm = () => {
  const [pjNomeEmpresa, setPjNomeEmpresa] = useState("");
  const [pjCnpj, setPjCnpj] = useState("");
  const [pjTelefone, setPjTelefone] = useState("");
  const [pjEmailComercial, setPjEmailComercial] = useState("");
  const [pjNomeResponsavel, setPjNomeResponsavel] = useState("");
  const [pjTelefoneResponsavel, setPjTelefoneResponsavel] = useState("");
  const [pjModeloImovel, setPjModeloImovel] = useState("");
  const [pjOutroModeloImovel, setPjOutroModeloImovel] = useState("");
  const [pjMediaContaEnergia, setPjMediaContaEnergia] = useState("");
  const [pjCep, setPjCep] = useState("");
  const [pjRua, setPjRua] = useState("");
  const [pjNumero, setPjNumero] = useState("");
  const [pjComplemento, setPjComplemento] = useState("");
  const [pjBairro, setPjBairro] = useState("");
  const [pjCidade, setPjCidade] = useState("");
  const [pjEstado, setPjEstado] = useState("");
  const [pjPretensaoPagamento, setPjPretensaoPagamento] = useState("");

  const resetPessoaJuridicaForm = useCallback(() => {
    setPjNomeEmpresa("");
    setPjCnpj("");
    setPjTelefone("");
    setPjEmailComercial("");
    setPjNomeResponsavel("");
    setPjTelefoneResponsavel("");
    setPjModeloImovel("");
    setPjOutroModeloImovel("");
    setPjMediaContaEnergia("");
    setPjCep("");
    setPjRua("");
    setPjNumero("");
    setPjComplemento("");
    setPjBairro("");
    setPjCidade("");
    setPjEstado("");
    setPjPretensaoPagamento("");
  }, []);

  const getValues = useCallback(() => {
    const payload = {
      razao_social: pjNomeEmpresa.trim(),
      cnpj: pjCnpj.trim(),
      telefone_comercial: pjTelefone.trim(),
      email_comercial: pjEmailComercial.trim(),
      nome_responsavel: pjNomeResponsavel.trim(),
      telefone_responsavel: pjTelefoneResponsavel.trim(),
      tipo_imovel_comercial: pjModeloImovel.trim(),
      media_conta_energia_pj: parseFloat((pjMediaContaEnergia || "0").replace(/[^\d]/g, '')) / 100,
      cep_pj: pjCep.trim(),
      rua_pj: pjRua.trim(),
      numero_pj: parseInt(pjNumero, 10),
      bairro_pj: pjBairro.trim(),
      cidade_pj: pjCidade.trim(),
      estado_pj: pjEstado.trim(),
      pretensao_pagamento_pj: pjPretensaoPagamento.trim().toUpperCase()
    };

    if (pjComplemento && pjComplemento.trim() !== "") {
      payload.complemento_pj = pjComplemento.trim();
    }

    if (pjModeloImovel === "Outro") {
      payload.outro_tipo_imovel_comercial = pjOutroModeloImovel.trim();
    }

    return payload;
  }, [
    pjNomeEmpresa,
    pjCnpj,
    pjTelefone,
    pjEmailComercial,
    pjNomeResponsavel,
    pjTelefoneResponsavel,
    pjModeloImovel,
    pjOutroModeloImovel,
    pjMediaContaEnergia,
    pjCep,
    pjRua,
    pjNumero,
    pjComplemento,
    pjBairro,
    pjCidade,
    pjEstado,
    pjPretensaoPagamento
  ]);

  return {
    pjNomeEmpresa, setPjNomeEmpresa,
    pjCnpj, setPjCnpj,
    pjTelefone, setPjTelefone,
    pjEmailComercial, setPjEmailComercial,
    pjNomeResponsavel, setPjNomeResponsavel,
    pjTelefoneResponsavel, setPjTelefoneResponsavel,
    pjModeloImovel, setPjModeloImovel,
    pjOutroModeloImovel, setPjOutroModeloImovel,
    pjMediaContaEnergia, setPjMediaContaEnergia,
    pjCep, setPjCep,
    pjRua, setPjRua,
    pjNumero, setPjNumero,
    pjComplemento, setPjComplemento,
    pjBairro, setPjBairro,
    pjCidade, setPjCidade,
    pjEstado, setPjEstado,
    pjPretensaoPagamento, setPjPretensaoPagamento,
    resetPessoaJuridicaForm,
    getValues,
  };
};