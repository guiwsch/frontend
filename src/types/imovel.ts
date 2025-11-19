export interface Imovel {
  id: number;
  titulo: string;
  descricao: string;
  tipo_imovel: 'casa' | 'apartamento' | 'terreno' | 'comercial';
  tipo_negocio: 'venda' | 'aluguel';
  preco_venda?: number;
  valor_aluguel?: number;
  preco: number;
  area_total: number;
  area_construida?: number;
  quartos: number;
  banheiros: number;
  vagas_garagem: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  piscina: boolean;
  aceita_pets: boolean;
  mobiliado: boolean;
  destaque: boolean;
  imagem_principal?: string;
  imagens?: ImovelImagem[];
  criado_em: string;
  atualizado_em: string;
}

export interface ImovelImagem {
  id: number;
  imagem_url: string;
  ordem: number;
  principal: boolean;
}

export interface Filtros {
  tipo_negocio: string;
  tipo_imovel: string;
  cidade: string;
  bairro: string;
  preco_min: string;
  preco_max: string;
  area_min: string;
  area_max: string;
  quartos: string;
  banheiros: string;
  vagas_garagem: string;
  piscina: boolean;
  aceita_pets: boolean;
  mobiliado: boolean;
  search: string;
  ordering: string;
}

export interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ImovelContextType {
  imoveis: Imovel[];
  imovel: Imovel | null;
  destaques: Imovel[];
  loading: boolean;
  pagination: Pagination;
  filtros: Filtros;
  fetchImoveis: (page?: number) => Promise<void>;
  fetchDestaques: () => Promise<void>;
  fetchImovel: (id: string | number) => Promise<Imovel | null>;
  createImovel: (data: Partial<Imovel>) => Promise<Imovel>;
  updateImovel: (id: number, data: Partial<Imovel>) => Promise<Imovel>;
  deleteImovel: (id: number) => Promise<boolean>;
  uploadImagem: (imovelId: number, imageFile: File, ordem?: number, principal?: boolean) => Promise<ImovelImagem>;
  updateFiltros: (novosFiltros: Partial<Filtros>) => void;
  limparFiltros: () => void;
}
