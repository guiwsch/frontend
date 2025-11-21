import { Typography, Button, Table, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useImovel } from '../../context/ImovelContext';
import styles from './Imoveis.module.css';

const { Title } = Typography;
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
  const { imoveis, loading, fetchImoveis, deleteImovel, toggleDestaque } = useImovel();

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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo_imovel',
      key: 'tipo_imovel',
      render: (tipo: string) => tipo.charAt(0).toUpperCase() + tipo.slice(1),
    },
    {
      title: 'Negócio',
      dataIndex: 'tipo_negocio',
      key: 'tipo_negocio',
      render: (tipo: string) => tipo.charAt(0).toUpperCase() + tipo.slice(1),
    },
    {
      title: 'Cidade',
      dataIndex: 'cidade',
      key: 'cidade',
    },
    {
      title: 'Preço',
      dataIndex: 'preco',
      key: 'preco',
      render: (preco: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(preco),
    },
    {
      title: 'Destaque',
      dataIndex: 'destaque',
      key: 'destaque',
      width: 100,
      align: 'center' as const,
      render: (destaque: boolean) => (
        destaque ? (
          <Tag color="gold" icon={<StarFilled />}>Destaque</Tag>
        ) : (
          <Tag>Normal</Tag>
        )
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: Imovel) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            title="Visualizar"
            onClick={() => navigate(`/imoveis/${record.id}`)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            title="Editar"
            onClick={() => navigate(`/admin/imoveis/editar/${record.id}`)}
          />
          <Button
            type="link"
            icon={record.destaque ? <StarFilled /> : <StarOutlined />}
            title={record.destaque ? 'Remover Destaque' : 'Destacar'}
            style={{ color: record.destaque ? '#faad14' : undefined }}
            onClick={() => handleToggleDestaque(record.id)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            title="Excluir"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.imoveisContainer}>
      <div className={styles.header}>
        <Title level={1} className={styles.title}>Gerenciar Imóveis</Title>
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

      <Table
        columns={columns}
        dataSource={imoveis}
        rowKey="id"
        loading={loading}
        locale={{
          emptyText: 'Nenhum imóvel cadastrado'
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} imóveis`,
        }}
        className={styles.table}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ImoveisAdmin;
