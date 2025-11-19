import { Link } from "react-router-dom";
import { HomeOutlined, KeyOutlined } from "@ant-design/icons";
import styles from "./Categorias.module.css";

interface Categoria {
  titulo: string;
  descricao: string;
  icon: React.ReactNode;
  link: string;
  image: string;
}

const Categorias = () => {
  const categorias: Categoria[] = [
    {
      titulo: "Comprar Imóvel",
      descricao: "Encontre sua casa própria",
      icon: <HomeOutlined />,
      link: "/imoveis?tipo_negocio=venda",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    },
    {
      titulo: "Alugar Imóvel",
      descricao: "Alugue com segurança",
      icon: <KeyOutlined />,
      link: "/imoveis?tipo_negocio=aluguel",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
    },
  ];

  return (
    <section className={styles.categoriasContainer}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>O que você procura?</h2>
        <div className={styles.grid}>
          {categorias.map((categoria, index) => (
            <Link
              key={index}
              to={categoria.link}
              className={styles.categoryCard}
              style={{ backgroundImage: `url(${categoria.image})` }}
            >
              <div className={styles.categoryContent}>
                <div className={styles.categoryIcon}>{categoria.icon}</div>
                <h3 className={styles.categoryTitle}>{categoria.titulo}</h3>
                <p className={styles.categoryDescription}>{categoria.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categorias;
