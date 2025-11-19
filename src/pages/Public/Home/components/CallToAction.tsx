import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import { Input, Button } from "antd";
import styles from "./CallToAction.module.css";

const { TextArea } = Input;

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

const CallToAction = () => {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/leads/contatos/", {
        ...formData,
        origem: "formulario_home",
      });

      toast.success(
        "Mensagem enviada com sucesso! Entraremos em contato em breve."
      );
      setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.ctaContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Precisa de Ajuda?</h2>
        <p className={styles.subtitle}>
          Entre em contato conosco e encontre o imóvel perfeito para você
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              name="nome"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={handleChange}
              required
              size="large"
            />
            <Input
              name="email"
              type="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
              size="large"
            />
          </div>
          <Input
            name="telefone"
            type="tel"
            placeholder="Seu telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            size="large"
            style={{ marginBottom: "1rem" }}
          />
          <TextArea
            name="mensagem"
            placeholder="Como podemos ajudar?"
            value={formData.mensagem}
            onChange={handleChange}
            required
            rows={4}
            style={{ marginBottom: "1rem" }}
          />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Enviar Mensagem
          </Button>
        </form>
      </div>
    </section>
  );
};

export default CallToAction;
