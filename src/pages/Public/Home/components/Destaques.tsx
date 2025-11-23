import { useImovel } from "../../../../context/ImovelContext";
import { Link } from "react-router-dom";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./Destaques.module.css";

const Destaques = () => {
  const { destaques, loading } = useImovel();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Helper para verificar se a URL é completa (http/https)
  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${baseURL}${url}`;
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={styles.destaquesContainer}>
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Imóveis em Destaque
        </motion.h2>
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
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {destaquesArray.map((imovel, index) => (
              <motion.div key={imovel.id} variants={cardVariants}>
                <Link
                  to={`/imoveis/${imovel.id}`}
                  className={styles.card}
                >
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: `url(${
                      imovel.imagem_principal
                        ? getImageUrl(imovel.imagem_principal)
                        : "https://via.placeholder.com/400x300"
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
              </motion.div>
            ))}
          </motion.div>
        )}
        <motion.div
          className={styles.buttonContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/imoveis" className={styles.viewAllButton}>
            Ver Todos os Imóveis
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Destaques;
