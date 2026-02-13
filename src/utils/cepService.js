export const fetchCepData = async (cep) => {
  const numericCep = cep.replace(/\D/g, '');
  if (numericCep.length !== 8) {
    throw new Error("Formato de CEP inválido. Utilize 8 números.");
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("ViaCEP API response error:", response.status, errorBody);
      throw new Error(`Falha ao buscar CEP. Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado na base de dados.");
    }
    return data;
  } catch (error) {
    console.error("Erro detalhado ao buscar CEP:", error);
    if (error instanceof Error && error.message) {
      throw error;
    }
    throw new Error("Ocorreu um problema ao tentar consultar o CEP. Verifique sua conexão ou tente mais tarde.");
  }
};

export const fetchEstados = async () => {
  try {
    const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
    if (!response.ok) throw new Error('Erro ao buscar estados');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    return [];
  }
};

export const fetchCidades = async (uf) => {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar cidades para o estado ${uf}`);
    }
    const data = await response.json();
    return data.map((cidade) => cidade.nome);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
};