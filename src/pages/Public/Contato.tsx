import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import styles from "./Contato.module.css";

const { TextArea } = Input;

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

const Contato = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/leads/contatos/", {
        ...formData,
        origem: "pagina_contato",
      });
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Entre em Contato</h1>
      <div className={styles.grid}>
        <div className={styles.infoBox}>
          <h2>Informações de Contato</h2>
          <div className={styles.infoItem}>
            <PhoneOutlined className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <h3>Telefone</h3>
              <p>(11) 1234-5678</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <MailOutlined className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <h3>E-mail</h3>
              <p>contato@imobilux.com.br</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <EnvironmentOutlined className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <h3>Endereço</h3>
              <p>Rua Exemplo, 123 - São Paulo, SP</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
            size="large"
            style={{ marginBottom: "1rem" }}
          />
          <Input
            name="email"
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
            size="large"
            style={{ marginBottom: "1rem" }}
          />
          <Input
            name="telefone"
            type="tel"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            size="large"
            style={{ marginBottom: "1rem" }}
          />
          <TextArea
            name="mensagem"
            placeholder="Mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            rows={6}
            style={{ marginBottom: "1rem" }}
          />
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contato;
