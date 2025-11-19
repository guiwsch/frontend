import styles from "./Sobre.module.css";

const Sobre = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sobre a ImobiLux</h1>
      <div className={styles.content}>
        <h2>Nossa História</h2>
        <p>
          A ImobiLux nasceu com o propósito de revolucionar o mercado imobiliário, oferecendo
          as melhores opções de imóveis com transparência, segurança e atendimento personalizado.
        </p>

        <h2>Missão</h2>
        <p>
          Facilitar a realização do sonho da casa própria, conectando pessoas aos melhores
          imóveis através de tecnologia e atendimento humanizado.
        </p>

        <h2>Visão</h2>
        <p>
          Ser a imobiliária mais confiável e inovadora do Brasil, referência em excelência
          e satisfação do cliente.
        </p>

        <h2>Valores</h2>
        <p>
          Transparência, Comprometimento, Inovação, Ética e Respeito ao Cliente.
        </p>
      </div>
    </div>
  );
};

export default Sobre;
