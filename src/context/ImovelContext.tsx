import { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Imovel, ImovelImagem, Filtros, Pagination, ImovelContextType } from '../types/imovel';

const ImovelContext = createContext<ImovelContextType | undefined>(undefined);

export const useImovel = () => {
  const context = useContext(ImovelContext);
  if (!context) {
    throw new Error('useImovel must be used within an ImovelProvider');
  }
  return context;
};

interface ImovelProviderProps {
  children: ReactNode;
}

export const ImovelProvider = ({ children }: ImovelProviderProps) => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [destaques, setDestaques] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    count: 0,
    next: null,
    previous: null
  });

  const [filtros, setFiltros] = useState<Filtros>({
    tipo_negocio: '',
    tipo_imovel: '',
    cidade: '',
    bairro: '',
    preco_min: '',
    preco_max: '',
    area_min: '',
    area_max: '',
    quartos: '',
    banheiros: '',
    vagas_garagem: '',
    piscina: false,
    aceita_pets: false,
    mobiliado: false,
    search: '',
    ordering: '-criado_em'
  });

  const fetchImoveis = useCallback(async (page = 1, filtrosCustom?: Partial<Filtros>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());

      // Usa filtrosCustom se fornecido, senão usa o estado filtros
      const filtrosParaUsar = filtrosCustom ? { ...filtros, ...filtrosCustom } : filtros;

      Object.entries(filtrosParaUsar).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          if (key === 'preco_min') {
            params.append('preco_venda__gte', value.toString());
          } else if (key === 'preco_max') {
            params.append('preco_venda__lte', value.toString());
          } else if (key === 'area_min') {
            params.append('area_total__gte', value.toString());
          } else if (key === 'area_max') {
            params.append('area_total__lte', value.toString());
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await api.get<{ results: Imovel[]; count: number; next: string | null; previous: string | null }>(`/api/imoveis/?${params.toString()}`);

      setImoveis(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      });
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const fetchDestaques = useCallback(async () => {
    try {
      const response = await api.get<Imovel[]>('/api/imoveis/destaques/');
      setDestaques(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      setDestaques([]);
    }
  }, []);

  const fetchImovel = useCallback(async (id: string | number) => {
    setLoading(true);
    try {
      const response = await api.get<Imovel>(`/api/imoveis/${id}/`);
      setImovel(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar imóvel:', error);
      toast.error('Erro ao carregar detalhes do imóvel');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createImovel = async (data: Partial<Imovel>) => {
    try {
      const response = await api.post<Imovel>('/api/imoveis/', data);
      toast.success('Imóvel criado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      toast.error('Erro ao criar imóvel');
      throw error;
    }
  };

  const updateImovel = async (id: number, data: Partial<Imovel>) => {
    try {
      const response = await api.put<Imovel>(`/api/imoveis/${id}/`, data);
      toast.success('Imóvel atualizado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      toast.error('Erro ao atualizar imóvel');
      throw error;
    }
  };

  const deleteImovel = async (id: number) => {
    try {
      await api.delete(`/api/imoveis/${id}/`);
      toast.success('Imóvel deletado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
      toast.error('Erro ao deletar imóvel');
      return false;
    }
  };

  const uploadImagem = async (imovelId: number, imageFile: File, ordem = 0, principal = false) => {
    try {
      const formData = new FormData();
      formData.append('imagem', imageFile);
      formData.append('ordem', ordem.toString());
      formData.append('principal', principal.toString());

      const response = await api.post<ImovelImagem>(`/api/imoveis/${imovelId}/upload_imagem/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Imagem enviada com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao enviar imagem');
      throw error;
    }
  };

  const toggleDestaque = async (id: number) => {
    try {
      const response = await api.patch<Imovel>(`/api/imoveis/${id}/toggle_destaque/`);
      toast.success(response.data.destaque ? 'Imóvel destacado com sucesso!' : 'Destaque removido com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao alternar destaque:', error);
      toast.error('Erro ao alternar destaque do imóvel');
      throw error;
    }
  };

  const updateFiltros = useCallback((novosFiltros: Partial<Filtros>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      tipo_negocio: '',
      tipo_imovel: '',
      cidade: '',
      bairro: '',
      preco_min: '',
      preco_max: '',
      area_min: '',
      area_max: '',
      quartos: '',
      banheiros: '',
      vagas_garagem: '',
      piscina: false,
      aceita_pets: false,
      mobiliado: false,
      search: '',
      ordering: '-criado_em'
    });
  }, []);

  const value: ImovelContextType = {
    imoveis,
    imovel,
    destaques,
    loading,
    pagination,
    filtros,
    fetchImoveis,
    fetchDestaques,
    fetchImovel,
    createImovel,
    updateImovel,
    deleteImovel,
    uploadImagem,
    toggleDestaque,
    updateFiltros,
    limparFiltros
  };

  return (
    <ImovelContext.Provider value={value}>
      {children}
    </ImovelContext.Provider>
  );
};
