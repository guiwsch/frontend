import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  HomeOutlined,
  FireOutlined,
  TrophyOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useImovel } from '../../context/ImovelContext';
import styles from './Imoveis.module.css';

const { confirm } = Modal;

interface Imovel {
  id: number;
  titulo: string;
  tipo_imovel: string;
  tipo_negocio: string;
  cidade: string;
  preco: number;
  destaque: boolean;
  imagem_principal?: string;
}

const ImoveisAdmin = () => {
  const navigate = useNavigate();
  const { imoveis, loading, fetchImoveis, deleteImovel, toggleDestaque } =
    useImovel();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${baseURL}${url}`;
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Tem certeza que deseja excluir este imóvel?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        const success = await deleteImovel(id);
        if (success) {
          message.success('Imóvel excluído com sucesso!');
          fetchImoveis();
        }
      },
    });
  };

  const handleToggleDestaque = async (id: number) => {
    try {
      await toggleDestaque(id);
      fetchImoveis();
    } catch (error) {
      console.error('Erro ao alternar destaque:', error);
    }
  };

  // Calcular estatísticas
  const stats = {
    total: imoveis.length,
    destaques: imoveis.filter((i) => i.destaque).length,
    venda: imoveis.filter((i) => i.tipo_negocio === 'venda').length,
    aluguel: imoveis.filter((i) => i.tipo_negocio === 'aluguel').length,
  };

  return (
    <div className={styles.imoveisContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <HomeOutlined className={styles.titleIcon} />
            Gerenciar Imóveis
          </h1>
          <p className={styles.subtitle}>Administre seu portfólio de imóveis</p>
        </div>
        <Link to="/admin/imoveis/novo">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className={styles.addButton}
          >
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statIcon}>
              <HomeOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total de Imóveis</p>
              <h2 className={styles.statValue}>{stats.total}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGold}`}>
            <div className={styles.statIcon}>
              <StarFilled />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Em Destaque</p>
              <h2 className={styles.statValue}>{stats.destaques}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statIcon}>
              <DollarOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Para Venda</p>
              <h2 className={styles.statValue}>{stats.venda}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardPurple}`}>
            <div className={styles.statIcon}>
              <FireOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Para Aluguel</p>
              <h2 className={styles.statValue}>{stats.aluguel}</h2>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Lista de Imóveis em Cards */}
      <div className={styles.imoveisGrid}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
          </div>
        ) : imoveis.length === 0 ? (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyState}>
              <HomeOutlined className={styles.emptyIcon} />
              <h3>Nenhum imóvel cadastrado</h3>
              <p>Clique em "Novo Imóvel" para adicionar seu primeiro imóvel</p>
            </div>
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {imoveis.map((imovel) => (
              <Col xs={24} md={12} lg={8} key={imovel.id}>
                <Card className={styles.imovelCard}>
                  {imovel.destaque && (
                    <div className={styles.destaqueTag}>
                      <StarFilled /> DESTAQUE
                    </div>
                  )}

                  <div className={styles.imovelImage}>
                    {imovel.imagem_principal ? (
                      <img
                        src={getImageUrl(imovel.imagem_principal)}
                        alt={imovel.titulo}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <HomeOutlined />
                      </div>
                    )}
                  </div>

                  <div className={styles.imovelContent}>
                    <div className={styles.imovelHeader}>
                      <h3 className={styles.imovelTitle}>{imovel.titulo}</h3>
                      <span className={styles.imovelId}>ID: #{imovel.id}</span>
                    </div>

                    <div className={styles.imovelInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Tipo:</span>
                        <Tag color="blue">
                          {imovel.tipo_imovel.charAt(0).toUpperCase() +
                            imovel.tipo_imovel.slice(1)}
                        </Tag>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Negócio:</span>
                        <Tag
                          color={
                            imovel.tipo_negocio === 'venda' ? 'green' : 'purple'
                          }
                        >
                          {imovel.tipo_negocio.charAt(0).toUpperCase() +
                            imovel.tipo_negocio.slice(1)}
                        </Tag>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Cidade:</span>
                        <span className={styles.infoValue}>
                          {imovel.cidade}
                        </span>
                      </div>
                    </div>

                    <div className={styles.priceSection}>
                      <DollarOutlined className={styles.priceIcon} />
                      <span className={styles.priceValue}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(imovel.preco)}
                      </span>
                    </div>

                    <div className={styles.imovelActions}>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/imoveis/${imovel.id}`)}
                        className={styles.viewButton}
                      >
                        Ver
                      </Button>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() =>
                          navigate(`/admin/imoveis/editar/${imovel.id}`)
                        }
                        className={styles.editButton}
                      >
                        Editar
                      </Button>
                      <Button
                        icon={
                          imovel.destaque ? <StarFilled /> : <StarOutlined />
                        }
                        onClick={() => handleToggleDestaque(imovel.id)}
                        className={
                          imovel.destaque
                            ? styles.destaqueButtonActive
                            : styles.destaqueButton
                        }
                      >
                        {imovel.destaque ? 'Destacado' : 'Destacar'}
                      </Button>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(imovel.id)}
                        className={styles.deleteButton}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default ImoveisAdmin;
