import { Typography, Table, Tag, Space, Button, Select } from 'antd';
import { PhoneOutlined, MailOutlined, WhatsAppOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styles from './Leads.module.css';

const { Title } = Typography;
const { Option } = Select;

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  imovelInteresse: string;
  status: 'novo' | 'contatado' | 'visitaAgendada' | 'negociacao' | 'convertido' | 'perdido';
  dataContato: string;
  origem: string;
}

const LeadsAdmin = () => {
  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      novo: 'blue',
      contatado: 'cyan',
      visitaAgendada: 'orange',
      negociacao: 'purple',
      convertido: 'green',
      perdido: 'red'
    };
    return colors[status];
  };

  const getStatusText = (status: Lead['status']) => {
    const texts = {
      novo: 'Novo',
      contatado: 'Contatado',
      visitaAgendada: 'Visita Agendada',
      negociacao: 'Negociação',
      convertido: 'Convertido',
      perdido: 'Perdido'
    };
    return texts[status];
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Contato',
      key: 'contato',
      render: (_: any, record: Lead) => (
        <Space direction="vertical" size="small">
          <span><MailOutlined /> {record.email}</span>
          <span><PhoneOutlined /> {record.telefone}</span>
        </Space>
      ),
    },
    {
      title: 'Imóvel de Interesse',
      dataIndex: 'imovelInteresse',
      key: 'imovelInteresse',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Lead['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Data de Contato',
      dataIndex: 'dataContato',
      key: 'dataContato',
    },
    {
      title: 'Origem',
      dataIndex: 'origem',
      key: 'origem',
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: Lead) => (
        <Space size="small">
          <Button
            type="link"
            icon={<PhoneOutlined />}
            title="Ligar"
          />
          <Button
            type="link"
            icon={<WhatsAppOutlined />}
            title="WhatsApp"
          />
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            title="Marcar como convertido"
          />
        </Space>
      ),
    },
  ];

  const data: Lead[] = [];

  return (
    <div className={styles.leadsContainer}>
      <div className={styles.header}>
        <Title level={1} className={styles.title}>Gerenciar Leads</Title>
        <Select
          placeholder="Filtrar por status"
          style={{ width: 200 }}
          allowClear
        >
          <Option value="novo">Novo</Option>
          <Option value="contatado">Contatado</Option>
          <Option value="visitaAgendada">Visita Agendada</Option>
          <Option value="negociacao">Negociação</Option>
          <Option value="convertido">Convertido</Option>
          <Option value="perdido">Perdido</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        locale={{
          emptyText: 'Nenhum lead cadastrado'
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} leads`,
        }}
        className={styles.table}
      />
    </div>
  );
};

export default LeadsAdmin;
