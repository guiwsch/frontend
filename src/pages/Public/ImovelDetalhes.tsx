import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useImovel } from '../../context/ImovelContext';
import { PulseLoader } from 'react-spinners';
import {
  HomeOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  CarOutlined,
  CheckCircleOutlined,
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  Carousel,
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Breadcrumb,
  Statistic,
  Tabs,
} from 'antd';
import { Imovel } from '../../types/imovel';
import styles from './ImovelDetalhes.module.css';

const ImovelDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchImovel, loading } = useImovel();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadImovel = async () => {
      if (id) {
        setShowContent(false);
        const data = await fetchImovel(id);
        setImovel(data);

        // Delay mínimo para transição suave
        setTimeout(() => {
          setShowContent(true);
        }, 300);
      }
    };
    loadImovel();
  }, [id]);

  if (loading || !imovel || !showContent) {
    return (
      <div className={styles.loadingContainer}>
        <PulseLoader color="#d4af37" size={15} margin={5} />
      </div>
    );
  }

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const images =
    imovel.imagens?.map((img) => `${baseURL}${img.imagem_url}`) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: ${imovel.titulo}`;
    window.open(
      `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const tabItems = [
    {
      key: '1',
      label: 'Descrição',
      children: (
        <div className={styles.tabContent}>
          <p className={styles.descriptionText}>{imovel.descricao}</p>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Detalhes',
      children: (
        <div className={styles.tabContent}>
          <Descriptions
            column={{ xs: 1, sm: 2, md: 2 }}
            bordered
            className={styles.descriptions}
          >
            <Descriptions.Item label="Tipo de Imóvel">
              <Tag color="gold">{imovel.tipo_imovel}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Negócio">
              <Tag color="blue">
                {imovel.tipo_negocio === 'venda' ? 'Venda' : 'Aluguel'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Quartos">
              {imovel.quartos}
            </Descriptions.Item>
            <Descriptions.Item label="Banheiros">
              {imovel.banheiros}
            </Descriptions.Item>
            <Descriptions.Item label="Área Total">
              {imovel.area_total}m²
            </Descriptions.Item>
            <Descriptions.Item label="Vagas de Garagem">
              {imovel.vagas_garagem}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">{imovel.cep}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={imovel.disponivel ? 'green' : 'red'}>
                {imovel.disponivel ? 'Disponível' : 'Indisponível'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Localização',
      children: (
        <div className={styles.tabContent}>
          <Descriptions column={1} bordered className={styles.descriptions}>
            <Descriptions.Item label="Endereço">
              {imovel.rua}, {imovel.numero}
            </Descriptions.Item>
            <Descriptions.Item label="Bairro">
              {imovel.bairro}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {imovel.cidade}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {imovel.estado}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">{imovel.cep}</Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          {
            title: <Link to="/">Início</Link>,
          },
          {
            title: <Link to="/imoveis">Imóveis</Link>,
          },
          {
            title: imovel.titulo,
          },
        ]}
      />

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        Voltar
      </Button>

      <Row gutter={[24, 24]} className={styles.mainRow}>
        {/* Coluna Principal - Imagens e Informações */}
        <Col xs={24} lg={16}>
          {/* Carousel de Imagens */}
          {images.length > 0 && (
            <Card className={styles.carouselCard} bodyStyle={{ padding: 0 }}>
              <Carousel autoplay className={styles.carousel}>
                {images.map((img, index) => (
                  <div key={index} className={styles.carouselSlide}>
                    <img src={img} alt={`${imovel.titulo} - ${index + 1}`} />
                  </div>
                ))}
              </Carousel>
            </Card>
          )}

          {/* Título e Preço */}
          <Card className={styles.infoCard}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <h1 className={styles.title}>{imovel.titulo}</h1>
                <p className={styles.location}>
                  <EnvironmentOutlined />
                  {imovel.rua}, {imovel.numero} - {imovel.bairro},{' '}
                  {imovel.cidade} - {imovel.estado}
                </p>
              </div>

              <div className={styles.priceSection}>
                <Statistic
                  title={
                    imovel.tipo_negocio === 'venda'
                      ? 'Preço de Venda'
                      : 'Valor do Aluguel'
                  }
                  value={imovel.preco_venda || imovel.valor_aluguel || 0}
                  precision={2}
                  prefix="R$"
                  valueStyle={{
                    background: 'linear-gradient(135deg, #d4af37, #ffd700)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    fontSize: '2rem',
                  }}
                />
              </div>

              <Divider />

              {/* Features Cards */}
              <Row gutter={[12, 12]} className={styles.featuresRow}>
                <Col xs={12} sm={12} md={6}>
                  <Card className={styles.featureCard}>
                    <Statistic
                      title="Quartos"
                      value={imovel.quartos}
                      prefix={<HomeOutlined />}
                      valueStyle={{ color: '#d4af37' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className={styles.featureCard}>
                    <Statistic
                      title="Banheiros"
                      value={imovel.banheiros}
                      prefix={<HomeOutlined />}
                      valueStyle={{ color: '#d4af37' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className={styles.featureCard}>
                    <Statistic
                      title="Área"
                      value={imovel.area_total}
                      suffix="m²"
                      prefix={<ExpandOutlined />}
                      valueStyle={{ color: '#d4af37' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <Card className={styles.featureCard}>
                    <Statistic
                      title="Vagas"
                      value={imovel.vagas_garagem}
                      prefix={<CarOutlined />}
                      valueStyle={{ color: '#d4af37' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider />

              {/* Características */}
              {(imovel.piscina || imovel.aceita_pets || imovel.mobiliado) && (
                <div>
                  <h3 className={styles.sectionTitle}>Características</h3>
                  <Space wrap>
                    {imovel.piscina && (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="blue"
                        className={styles.amenityTag}
                      >
                        Piscina
                      </Tag>
                    )}
                    {imovel.aceita_pets && (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="green"
                        className={styles.amenityTag}
                      >
                        Aceita Pets
                      </Tag>
                    )}
                    {imovel.mobiliado && (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="purple"
                        className={styles.amenityTag}
                      >
                        Mobiliado
                      </Tag>
                    )}
                  </Space>
                </div>
              )}

              <Divider />

              {/* Tabs com Informações */}
              <Tabs items={tabItems} className={styles.tabs} />
            </Space>
          </Card>
        </Col>

        {/* Coluna Lateral - Contato */}
        <Col xs={24} lg={8}>
          <Card
            className={styles.contactCard}
            title="Interessado?"
            bordered={false}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <p className={styles.contactText}>
                Entre em contato conosco para agendar uma visita ou tirar suas
                dúvidas!
              </p>

              <Button
                type="primary"
                size="large"
                icon={<WhatsAppOutlined />}
                onClick={handleWhatsAppContact}
                className={styles.whatsappButton}
                block
              >
                Contato via WhatsApp
              </Button>

              <Button
                size="large"
                icon={<PhoneOutlined />}
                className={styles.phoneButton}
                block
              >
                (11) 99999-9999
              </Button>

              <Button
                size="large"
                icon={<MailOutlined />}
                className={styles.emailButton}
                block
              >
                Enviar E-mail
              </Button>

              <Divider />

              <div className={styles.propertyInfo}>
                <p className={styles.infoLabel}>
                  <CalendarOutlined /> Publicado em
                </p>
                <p className={styles.infoValue}>
                  {new Date(imovel.data_cadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className={styles.propertyInfo}>
                <p className={styles.infoLabel}>
                  <DollarOutlined /> Código do Imóvel
                </p>
                <p className={styles.infoValue}>#{imovel.id}</p>
              </div>
            </Space>
          </Card>

          {/* Card de Alerta */}
          {/* <Card className={styles.alertCard}>
            <Space direction="vertical" size="small">
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <p className={styles.alertTitle}>Imóvel Verificado</p>
              <p className={styles.alertText}>
                Este imóvel foi verificado e está disponível para visitação.
              </p>
            </Space>
          </Card> */}
        </Col>
      </Row>
    </div>
  );
};

export default ImovelDetalhes;
