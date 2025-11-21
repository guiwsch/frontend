import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import { Input, Button } from "antd";
import { motion } from "framer-motion";
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
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Precisa de Ajuda?
        </motion.h2>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Entre em contato conosco e encontre o imóvel perfeito para você
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className={styles.form}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
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
        </motion.form>
      </div>
    </section>
  );
};

export default CallToAction;
