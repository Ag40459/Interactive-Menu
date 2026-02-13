
import axios from 'axios';

/**
 * Busca dados de um CNPJ na API
 * @param {string} cnpj - CNPJ a ser consultado (apenas números)
 * @returns {Promise<Object>} - Dados do CNPJ
 */
export const fetchCNPJData = async (cnpj) => {
   const cleanCnpjData = cnpj.replace(/\D/g, '');
  if (cleanCnpjData.length !== 14) return null;
  try {
    // Remove caracteres não numéricos
    const cleanCNPJData = cnpj.replace(/[^\d]/g, '');
    
    if (cleanCNPJData.length !== 14) {
      throw new Error('CNPJ deve conter 14 dígitos');
    }
    
    // Chamada para a API de CNPJ
    const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpjData}`);
    
    if (response.status !== 200) {
      throw new Error('Erro ao consultar CNPJ');
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do CNPJ:', error);
    throw new Error('Não foi possível consultar o CNPJ. Verifique se o número está correto.');
  }
};

export default {
  fetchCNPJData
};