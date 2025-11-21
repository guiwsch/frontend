import {
  HomeOutlined,
  RocketOutlined,
  EyeOutlined,
  HeartOutlined,
  SafetyOutlined,
  TeamOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import styles from "./Sobre.module.css";

const Sobre = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Sobre a <span className={styles.logoAccent}>ImobiLux</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Transformando sonhos em endereços desde 2020
          </p>
        </div>
      </section>

      {/* História Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.storyCard}>
            <div className={styles.storyIcon}>
              <HomeOutlined />
            </div>
            <div className={styles.storyContent}>
              <h2 className={styles.sectionTitle}>Nossa História</h2>
              <p className={styles.text}>
                A ImobiLux nasceu com o propósito de revolucionar o mercado imobiliário, oferecendo
                as melhores opções de imóveis com transparência, segurança e atendimento personalizado.
                Com anos de experiência e um time apaixonado pelo que faz, nos tornamos referência
                em encontrar o imóvel perfeito para cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className={styles.sectionGray}>
        <div className={styles.container}>
          <div className={styles.gridThree}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <RocketOutlined />
              </div>
              <h3 className={styles.cardTitle}>Missão</h3>
              <p className={styles.cardText}>
                Facilitar a realização do sonho da casa própria, conectando pessoas aos melhores
                imóveis através de tecnologia e atendimento humanizado.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <EyeOutlined />
              </div>
              <h3 className={styles.cardTitle}>Visão</h3>
              <p className={styles.cardText}>
                Ser a imobiliária mais confiável e inovadora do Brasil, referência em excelência
                e satisfação do cliente.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <HeartOutlined />
              </div>
              <h3 className={styles.cardTitle}>Valores</h3>
              <p className={styles.cardText}>
                Transparência, Comprometimento, Inovação, Ética e Respeito ao Cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Nossos Diferenciais</h2>
          <p className={styles.sectionSubtitle}>
            O que nos torna únicos no mercado imobiliário
          </p>

          <div className={styles.gridFour}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <SafetyOutlined />
              </div>
              <h4 className={styles.featureTitle}>Segurança</h4>
              <p className={styles.featureText}>
                Processos transparentes e documentação completa
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TeamOutlined />
              </div>
              <h4 className={styles.featureTitle}>Equipe Especializada</h4>
              <p className={styles.featureText}>
                Profissionais experientes e dedicados
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <TrophyOutlined />
              </div>
              <h4 className={styles.featureTitle}>Excelência</h4>
              <p className={styles.featureText}>
                Comprometimento com a qualidade em tudo
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ThunderboltOutlined />
              </div>
              <h4 className={styles.featureTitle}>Agilidade</h4>
              <p className={styles.featureText}>
                Processos rápidos e eficientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Pronto para encontrar seu próximo imóvel?</h2>
          <p className={styles.ctaText}>
            Entre em contato conosco e descubra como podemos ajudar você
          </p>
          <a href="/contato" className={styles.ctaButton}>
            Fale Conosco
          </a>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
