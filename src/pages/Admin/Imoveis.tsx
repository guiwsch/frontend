import { Typography, Button, Table, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './Imoveis.module.css';

const { Title } = Typography;

interface Imovel {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  cidade: string;
  preco: number;
  status: string;
}

const ImoveisAdmin = () => {
  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
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
      render: (preco: number) => `R$ ${preco.toLocaleString('pt-BR')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            title="Editar"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            title="Excluir"
          />
        </Space>
      ),
    },
  ];

  const data: Imovel[] = [];

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
        dataSource={data}
        locale={{
          emptyText: 'Nenhum imóvel cadastrado'
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} imóveis`,
        }}
        className={styles.table}
      />
    </div>
  );
};

export default ImoveisAdmin;
