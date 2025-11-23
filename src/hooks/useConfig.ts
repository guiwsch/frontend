import { useState, useEffect } from 'react';
import api from '../services/api';

export interface ConfigData {
  nome_empresa: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  site?: string;
  sobre?: string;
  notificacao_email: boolean;
  notificacao_sms: boolean;
  notificacao_whatsapp: boolean;
}

const defaultConfig: ConfigData = {
  nome_empresa: 'ImobiLux',
  email: 'contato@imobilux.com.br',
  telefone: '(11) 1234-5678',
  whatsapp: '(11) 91234-5678',
  endereco: 'Rua Exemplo, 123 - São Paulo, SP',
  site: 'www.imobilux.com.br',
  sobre: 'Encontre o lar dos seus sonhos com a melhor imobiliária da região.',
  notificacao_email: true,
  notificacao_sms: false,
  notificacao_whatsapp: true,
};

export const useConfig = () => {
  const [config, setConfig] = useState<ConfigData>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/configuracoes/');
        setConfig(response.data);
        setError(null);
      } catch (err: any) {
        // Se não houver configurações salvas (404), usa o padrão
        if (err.response?.status === 404) {
          setConfig(defaultConfig);
        } else {
          console.error('Erro ao carregar configurações:', err);
          setError(err);
          setConfig(defaultConfig);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
