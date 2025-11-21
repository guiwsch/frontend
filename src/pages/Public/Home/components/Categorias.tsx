import { Link } from "react-router-dom";
import { HomeOutlined, KeyOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
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
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          O que você procura?
        </motion.h2>
        <div className={styles.grid}>
          {categorias.map((categoria, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Link
                to={categoria.link}
                className={styles.categoryCard}
                style={{ backgroundImage: `url(${categoria.image})` }}
              >
                <div className={styles.categoryContent}>
                  <motion.div
                    className={styles.categoryIcon}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {categoria.icon}
                  </motion.div>
                  <h3 className={styles.categoryTitle}>{categoria.titulo}</h3>
                  <p className={styles.categoryDescription}>{categoria.descricao}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categorias;
