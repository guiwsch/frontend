import {
  CheckCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styles from "./Diferenciais.module.css";

interface Diferencial {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
}

const Diferenciais = () => {
  const diferenciais: Diferencial[] = [
    {
      icon: <CheckCircleOutlined />,
      titulo: "Imóveis Verificados",
      descricao: "Todos os nossos imóveis passam por rigorosa verificação",
    },
    {
      icon: <SafetyOutlined />,
      titulo: "Segurança Garantida",
      descricao: "Transações seguras e documentação completa",
    },
    {
      icon: <TeamOutlined />,
      titulo: "Atendimento Personalizado",
      descricao: "Equipe especializada para atender você",
    },
    {
      icon: <TrophyOutlined />,
      titulo: "Anos de Experiência",
      descricao: "Tradição e confiabilidade no mercado imobiliário",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={styles.diferenciaisContainer}>
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Por que escolher a ImobiLux?
        </motion.h2>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {diferenciais.map((item, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={styles.icon}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <h3 className={styles.cardTitle}>{item.titulo}</h3>
              <p className={styles.cardDescription}>{item.descricao}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Diferenciais;
