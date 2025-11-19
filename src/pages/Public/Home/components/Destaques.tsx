import { useImovel } from "../../../../context/ImovelContext";
import { Link } from "react-router-dom";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import styles from "./Destaques.module.css";

const Destaques = () => {
  const { destaques, loading } = useImovel();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  const destaquesArray = Array.isArray(destaques) ? destaques : [];

  return (
    <section className={styles.destaquesContainer}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Imóveis em Destaque</h2>
        {destaquesArray.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum imóvel em destaque no momento.</p>
            {process.env.NODE_ENV === "development" && (
              <p style={{ fontSize: "14px", marginTop: "10px" }}>
                Backend não está rodando ou não há dados disponíveis.
              </p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {destaquesArray.map((imovel) => (
              <Link
                key={imovel.id}
                to={`/imoveis/${imovel.id}`}
                className={styles.card}
              >
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: `url(${
                      imovel.imagem_principal ||
                      "https://via.placeholder.com/400x300"
                    })`,
                  }}
                >
                  {imovel.destaque && (
                    <span className={styles.badge}>Destaque</span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{imovel.titulo}</h3>
                  <p className={styles.cardLocation}>
                    <EnvironmentOutlined className={styles.locationIcon} />
                    {imovel.bairro}, {imovel.cidade}
                  </p>
                  <div className={styles.cardFeatures}>
                    <div className={styles.feature}>
                      <HomeOutlined className={styles.featureIcon} />{" "}
                      {imovel.quartos}
                    </div>
                    <div className={styles.feature}>
                      <HomeOutlined className={styles.featureIcon} />{" "}
                      {imovel.banheiros}
                    </div>
                    <div className={styles.feature}>
                      <ExpandOutlined className={styles.featureIcon} />{" "}
                      {imovel.area_total}m²
                    </div>
                  </div>
                  <div className={styles.cardPrice}>
                    {formatPrice(imovel.preco)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className={styles.buttonContainer}>
          <Link to="/imoveis" className={styles.viewAllButton}>
            Ver Todos os Imóveis
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destaques;
