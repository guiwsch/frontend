import {
  CheckCircleOutlined,
  SafetyOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
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

  return (
    <section className={styles.diferenciaisContainer}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Por que escolher a ImobiLux?</h2>
        <div className={styles.grid}>
          {diferenciais.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <h3 className={styles.cardTitle}>{item.titulo}</h3>
              <p className={styles.cardDescription}>{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diferenciais;
