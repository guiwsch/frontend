import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useImovel } from "../../context/ImovelContext";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ExpandOutlined,
  CarOutlined,
  FilterOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { Spin, Select, InputNumber, Checkbox, Button, Drawer } from "antd";
import styles from "./ImovelListagem.module.css";

const { Option } = Select;

const ImovelListagem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { imoveis, loading, fetchImoveis, updateFiltros } = useImovel();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Estado para os filtros
  const [filters, setFilters] = useState({
    tipo_imovel: searchParams.get('tipo_imovel') || '',
    tipo_negocio: searchParams.get('tipo_negocio') || '',
    cidade: searchParams.get('cidade') || '',
    bairro: searchParams.get('bairro') || '',
    preco_min: searchParams.get('preco_min') || '',
    preco_max: searchParams.get('preco_max') || '',
    quartos: searchParams.get('quartos') || '',
    banheiros: searchParams.get('banheiros') || '',
    vagas: searchParams.get('vagas') || '',
    area_min: searchParams.get('area_min') || '',
    piscina: searchParams.get('piscina') === 'true',
    aceita_pets: searchParams.get('aceita_pets') === 'true',
    mobiliado: searchParams.get('mobiliado') === 'true',
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Converte searchParams para string para usar como dependência
  const searchParamsString = searchParams.toString();

  // Atualiza filtros e busca imóveis quando os parâmetros da URL mudarem
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Atualiza os filtros no contexto e busca usando os novos filtros imediatamente
    updateFiltros(params);
    fetchImoveis(1, params); // Passa os filtros diretamente para evitar delay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]); // Usa string como dependência para evitar loops

  // Aplica filtros
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== false) {
        newSearchParams.set(key, String(value));
      }
    });

    navigate(`/imoveis?${newSearchParams.toString()}`);
    setIsFilterDrawerOpen(false);
  };

  // Limpa filtros
  const clearFilters = () => {
    const tipoNegocio = searchParams.get('tipo_negocio');
    const newFilters = {
      tipo_imovel: '',
      tipo_negocio: tipoNegocio || '',
      cidade: '',
      bairro: '',
      preco_min: '',
      preco_max: '',
      quartos: '',
      banheiros: '',
      vagas: '',
      area_min: '',
      piscina: false,
      aceita_pets: false,
      mobiliado: false,
    };
    setFilters(newFilters);

    if (tipoNegocio) {
      navigate(`/imoveis?tipo_negocio=${tipoNegocio}`);
    } else {
      navigate('/imoveis');
    }
    setIsFilterDrawerOpen(false);
  };

  // Conta filtros ativos
  const countActiveFilters = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'tipo_negocio' && value !== '' && value !== false) {
        count++;
      }
    });
    return count;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Determina o título baseado no filtro
  const getPageTitle = () => {
    const tipoNegocio = searchParams.get('tipo_negocio');
    if (tipoNegocio === 'venda') {
      return 'Imóveis à Venda';
    } else if (tipoNegocio === 'aluguel') {
      return 'Imóveis para Alugar';
    }
    return 'Todos os Imóveis';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Carregando imóveis..." />
      </div>
    );
  }

  // Componente de Filtros
  const FilterContent = () => (
    <div className={styles.filterContent}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Tipo de Imóvel</label>
        <Select
          placeholder="Selecione"
          value={filters.tipo_imovel || undefined}
          onChange={(value) => setFilters({ ...filters, tipo_imovel: value })}
          allowClear
          className={styles.filterInput}
        >
          <Option value="casa">Casa</Option>
          <Option value="apartamento">Apartamento</Option>
          <Option value="terreno">Terreno</Option>
          <Option value="comercial">Comercial</Option>
        </Select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Cidade</label>
        <Select
          placeholder="Selecione"
          value={filters.cidade || undefined}
          onChange={(value) => setFilters({ ...filters, cidade: value })}
          allowClear
          showSearch
          className={styles.filterInput}
        >
          <Option value="São Paulo">São Paulo</Option>
          <Option value="Rio de Janeiro">Rio de Janeiro</Option>
          <Option value="Belo Horizonte">Belo Horizonte</Option>
          <Option value="Curitiba">Curitiba</Option>
        </Select>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Preço Mínimo</label>
          <InputNumber
            placeholder="R$ Min"
            value={filters.preco_min ? Number(filters.preco_min) : undefined}
            onChange={(value) => setFilters({ ...filters, preco_min: value ? String(value) : '' })}
            formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
            className={styles.filterInput}
            style={{ width: '100%' }}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Preço Máximo</label>
          <InputNumber
            placeholder="R$ Max"
            value={filters.preco_max ? Number(filters.preco_max) : undefined}
            onChange={(value) => setFilters({ ...filters, preco_max: value ? String(value) : '' })}
            formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
            className={styles.filterInput}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Quartos</label>
          <Select
            placeholder="Mín"
            value={filters.quartos || undefined}
            onChange={(value) => setFilters({ ...filters, quartos: value })}
            allowClear
            className={styles.filterInput}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <Option key={num} value={String(num)}>{num}+</Option>
            ))}
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Banheiros</label>
          <Select
            placeholder="Mín"
            value={filters.banheiros || undefined}
            onChange={(value) => setFilters({ ...filters, banheiros: value })}
            allowClear
            className={styles.filterInput}
          >
            {[1, 2, 3, 4].map(num => (
              <Option key={num} value={String(num)}>{num}+</Option>
            ))}
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Vagas</label>
          <Select
            placeholder="Mín"
            value={filters.vagas || undefined}
            onChange={(value) => setFilters({ ...filters, vagas: value })}
            allowClear
            className={styles.filterInput}
          >
            {[1, 2, 3, 4].map(num => (
              <Option key={num} value={String(num)}>{num}+</Option>
            ))}
          </Select>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Área Mínima (m²)</label>
        <InputNumber
          placeholder="Ex: 50"
          value={filters.area_min ? Number(filters.area_min) : undefined}
          onChange={(value) => setFilters({ ...filters, area_min: value ? String(value) : '' })}
          className={styles.filterInput}
          style={{ width: '100%' }}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Características</label>
        <div className={styles.checkboxGroup}>
          <Checkbox
            checked={filters.piscina}
            onChange={(e) => setFilters({ ...filters, piscina: e.target.checked })}
          >
            Piscina
          </Checkbox>
          <Checkbox
            checked={filters.aceita_pets}
            onChange={(e) => setFilters({ ...filters, aceita_pets: e.target.checked })}
          >
            Aceita Pets
          </Checkbox>
          <Checkbox
            checked={filters.mobiliado}
            onChange={(e) => setFilters({ ...filters, mobiliado: e.target.checked })}
          >
            Mobiliado
          </Checkbox>
        </div>
      </div>

      <div className={styles.filterActions}>
        <Button onClick={clearFilters} className={styles.clearButton}>
          Limpar Filtros
        </Button>
        <Button type="primary" onClick={applyFilters} className={styles.applyButton}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          {imoveis.length > 0 && (
            <p className={styles.resultCount}>
              {imoveis.length} {imoveis.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
          )}
        </div>

        <Button
          type="default"
          icon={<FilterOutlined />}
          onClick={() => setIsFilterDrawerOpen(true)}
          className={styles.filterButton}
        >
          Filtros {countActiveFilters() > 0 && `(${countActiveFilters()})`}
        </Button>
      </div>

      <div className={styles.contentWrapper}>
        {/* Filtros Desktop - Sidebar */}
        <aside className={styles.filterSidebar}>
          <div className={styles.filterHeader}>
            <h3>Filtros</h3>
            {countActiveFilters() > 0 && (
              <span className={styles.filterBadge}>{countActiveFilters()}</span>
            )}
          </div>
          <FilterContent />
        </aside>

        {/* Lista de Imóveis */}
        <main className={styles.mainContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" tip="Carregando imóveis..." />
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {imoveis.map((imovel) => (
                  <Link
                    key={imovel.id}
                    to={`/imoveis/${imovel.id}`}
                    className={styles.card}
                  >
                    <div
                      className={styles.cardImage}
                      style={{
                        backgroundImage: `url(${
                          imovel.imagem_principal
                            ? `${baseURL}${imovel.imagem_principal}`
                            : "https://via.placeholder.com/400x300"
                        })`,
                      }}
                    />
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{imovel.titulo}</h3>
                      <p className={styles.cardLocation}>
                        <EnvironmentOutlined />
                        {imovel.bairro}, {imovel.cidade}
                      </p>
                      <div className={styles.cardFeatures}>
                        <div className={styles.feature}>
                          <HomeOutlined /> {imovel.quartos}
                        </div>
                        <div className={styles.feature}>
                          <HomeOutlined /> {imovel.banheiros}
                        </div>
                        <div className={styles.feature}>
                          <ExpandOutlined /> {imovel.area_total}m²
                        </div>
                        {imovel.vagas_garagem > 0 && (
                          <div className={styles.feature}>
                            <CarOutlined /> {imovel.vagas_garagem}
                          </div>
                        )}
                      </div>
                      <div className={styles.cardPrice}>
                        {formatPrice(imovel.preco)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {imoveis.length === 0 && (
                <p className={styles.emptyState}>Nenhum imóvel encontrado.</p>
              )}
            </>
          )}
        </main>
      </div>

      {/* Drawer de Filtros Mobile */}
      <Drawer
        title="Filtros"
        placement="right"
        onClose={() => setIsFilterDrawerOpen(false)}
        open={isFilterDrawerOpen}
        width={320}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsFilterDrawerOpen(false)}
          />
        }
      >
        <FilterContent />
      </Drawer>
    </div>
  );
};

export default ImovelListagem;
