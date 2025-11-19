import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useImovel } from "../../context/ImovelContext";
import ImageGallery from "react-image-gallery";
import {
  HomeOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  CarOutlined
} from "@ant-design/icons";
import { Spin } from "antd";
import { Imovel } from "../../types/imovel";
import styles from "./ImovelDetalhes.module.css";
import "react-image-gallery/styles/css/image-gallery.css";

const ImovelDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchImovel, loading } = useImovel();
  const [imovel, setImovel] = useState<Imovel | null>(null);

  useEffect(() => {
    const loadImovel = async () => {
      if (id) {
        const data = await fetchImovel(id);
        setImovel(data);
      }
    };
    loadImovel();
  }, [id]);

  if (loading || !imovel) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Carregando detalhes..." />
      </div>
    );
  }

  const images =
    imovel.imagens?.map((img) => ({
      original: img.imagem_url,
      thumbnail: img.imagem_url,
    })) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className={styles.container}>
      {images.length > 0 && (
        <div className={styles.galleryContainer}>
          <ImageGallery items={images} />
        </div>
      )}

      <div className={styles.grid}>
        <div>
          <h1 className={styles.title}>{imovel.titulo}</h1>
          <div className={styles.price}>
            {formatPrice(imovel.preco_venda || imovel.valor_aluguel || 0)}
          </div>
          <p className={styles.location}>
            <EnvironmentOutlined />
            {imovel.rua}, {imovel.numero} - {imovel.bairro}, {imovel.cidade} -{" "}
            {imovel.estado}
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <HomeOutlined className={styles.featureIcon} />
              <span className={styles.featureValue}>{imovel.quartos}</span>
              <small className={styles.featureLabel}>Quartos</small>
            </div>
            <div className={styles.feature}>
              <HomeOutlined className={styles.featureIcon} />
              <span className={styles.featureValue}>{imovel.banheiros}</span>
              <small className={styles.featureLabel}>Banheiros</small>
            </div>
            <div className={styles.feature}>
              <ExpandOutlined className={styles.featureIcon} />
              <span className={styles.featureValue}>{imovel.area_total}m²</span>
              <small className={styles.featureLabel}>Área Total</small>
            </div>
            <div className={styles.feature}>
              <CarOutlined className={styles.featureIcon} />
              <span className={styles.featureValue}>{imovel.vagas_garagem}</span>
              <small className={styles.featureLabel}>Vagas</small>
            </div>
          </div>

          <div className={styles.description}>
            <h2 className={styles.descriptionTitle}>Descrição</h2>
            <p className={styles.descriptionText}>{imovel.descricao}</p>
          </div>
        </div>

        <div>{/* Sidebar - Formulário de contato pode ser adicionado aqui */}</div>
      </div>
    </div>
  );
};

export default ImovelDetalhes;
