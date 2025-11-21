import { Typography, Table, Tag, Space, Button, Select, Modal, message } from 'antd';
import { PhoneOutlined, MailOutlined, WhatsAppOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Leads.module.css';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  status: 'novo' | 'contatado' | 'visitaAgendada' | 'negociacao' | 'convertido' | 'perdido';
  created_at: string;
  updated_at?: string;
  origem?: string;
}

const LeadsAdmin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status_filter', statusFilter);
      }

      const response = await api.get(`/api/leads/?${params.toString()}`);
      setLeads(response.data);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      message.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleUpdateStatus = async (leadId: number, newStatus: string) => {
    try {
      await api.put(`/api/leads/${leadId}/`, { status: newStatus });
      message.success('Status atualizado com sucesso!');
      fetchLeads();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      message.error('Erro ao atualizar status');
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Tem certeza que deseja excluir este lead?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await api.delete(`/api/leads/${id}/`);
          message.success('Lead excluído com sucesso!');
          fetchLeads();
        } catch (error) {
          console.error('Erro ao excluir lead:', error);
          message.error('Erro ao excluir lead');
        }
      },
    });
  };
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
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
      title: 'Mensagem',
      dataIndex: 'mensagem',
      key: 'mensagem',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Lead['status'], record: Lead) => (
        <Select
          value={status}
          onChange={(newStatus) => handleUpdateStatus(record.id, newStatus)}
          style={{ width: 150 }}
        >
          <Option value="novo">
            <Tag color="blue">Novo</Tag>
          </Option>
          <Option value="contatado">
            <Tag color="cyan">Contatado</Tag>
          </Option>
          <Option value="visitaAgendada">
            <Tag color="orange">Visita Agendada</Tag>
          </Option>
          <Option value="negociacao">
            <Tag color="purple">Negociação</Tag>
          </Option>
          <Option value="convertido">
            <Tag color="green">Convertido</Tag>
          </Option>
          <Option value="perdido">
            <Tag color="red">Perdido</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Origem',
      dataIndex: 'origem',
      key: 'origem',
      render: (origem: string | undefined) => origem || 'Site',
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
            href={`tel:${record.telefone}`}
          />
          <Button
            type="link"
            icon={<WhatsAppOutlined />}
            title="WhatsApp"
            href={`https://wa.me/55${record.telefone.replace(/\D/g, '')}`}
            target="_blank"
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
    <div className={styles.leadsContainer}>
      <div className={styles.header}>
        <Title level={1} className={styles.title}>Gerenciar Leads</Title>
        <Select
          placeholder="Filtrar por status"
          style={{ width: 200 }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
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
        dataSource={leads}
        rowKey="id"
        loading={loading}
        locale={{
          emptyText: 'Nenhum lead cadastrado'
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} leads`,
        }}
        className={styles.table}
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default LeadsAdmin;
