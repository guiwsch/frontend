import { Link } from "react-router-dom";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useConfig } from "../../hooks/useConfig";
import styles from "./Footer.module.css";

const Footer = () => {
  const { config } = useConfig();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>{config.nome_empresa}</h3>
          <p>
            {config.sobre || "Encontre o lar dos seus sonhos com a melhor imobiliária da região."}
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <LinkedinOutlined />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Links Rápidos</h3>
          <Link to="/imoveis?tipo_negocio=venda">Comprar Imóveis</Link>
          <Link to="/imoveis?tipo_negocio=aluguel">Alugar Imóveis</Link>
          <Link to="/sobre">Sobre Nós</Link>
          <Link to="/contato">Contato</Link>
        </div>

        <div className={styles.footerSection}>
          <h3>Contato</h3>
          <p>
            <PhoneOutlined /> {config.telefone}
          </p>
          <p>
            <MailOutlined /> {config.email}
          </p>
          <p>
            <EnvironmentOutlined /> {config.endereco}
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Horário de Atendimento</h3>
          <p>Segunda a Sexta: 8h - 18h</p>
          <p>Sábado: 9h - 13h</p>
          <p>Domingo: Fechado</p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} {config.nome_empresa}. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
