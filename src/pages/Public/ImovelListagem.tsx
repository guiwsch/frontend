import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useImovel } from "../../context/ImovelContext";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ExpandOutlined,
  CarOutlined
} from "@ant-design/icons";
import { Spin } from "antd";
import styles from "./ImovelListagem.module.css";

const ImovelListagem = () => {
  const [searchParams] = useSearchParams();
  const { imoveis, loading, fetchImoveis, updateFiltros } = useImovel();

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    updateFiltros(params);
    fetchImoveis();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Carregando imóveis..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Imóveis Disponíveis</h1>
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
                  imovel.imagem_principal || "https://via.placeholder.com/400x300"
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
    </div>
  );
};

export default ImovelListagem;
