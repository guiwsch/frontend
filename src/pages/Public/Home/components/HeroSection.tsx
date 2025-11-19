import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Button } from "antd";
import styles from "./HeroSection.module.css";

const { Option } = Select;

interface SearchParams {
  tipo_negocio: string;
  tipo_imovel: string;
  cidade: string;
  preco_max: string;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tipo_negocio: "",
    tipo_imovel: "",
    cidade: "",
    preco_max: "",
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    navigate(`/imoveis?${params.toString()}`);
  };

  const handleSelectChange = (value: string, field: keyof SearchParams) => {
    setSearchParams({
      ...searchParams,
      [field]: value,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Encontre o Lar dos Seus Sonhos</h1>
        <p className={styles.subtitle}>
          As melhores opções de imóveis para compra e aluguel
        </p>

        <div className={styles.searchBox}>
          <Select
            placeholder="Comprar ou Alugar"
            value={searchParams.tipo_negocio || undefined}
            onChange={(value) => handleSelectChange(value, "tipo_negocio")}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="venda">Comprar</Option>
            <Option value="aluguel">Alugar</Option>
          </Select>

          <Select
            placeholder="Tipo de Imóvel"
            value={searchParams.tipo_imovel || undefined}
            onChange={(value) => handleSelectChange(value, "tipo_imovel")}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="casa">Casa</Option>
            <Option value="apartamento">Apartamento</Option>
            <Option value="terreno">Terreno</Option>
            <Option value="comercial">Comercial</Option>
          </Select>

          <Input
            name="cidade"
            placeholder="Digite a cidade"
            value={searchParams.cidade}
            onChange={handleInputChange}
            size="large"
          />

          <Input
            name="preco_max"
            type="number"
            placeholder="Valor Máximo"
            value={searchParams.preco_max}
            onChange={handleInputChange}
            size="large"
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            size="large"
            style={{ width: "100%" }}
          >
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
