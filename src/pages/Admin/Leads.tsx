import { Card, Row, Col, Tag, Space, Button, Select, Modal, message, Statistic, Avatar, Badge } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  DeleteOutlined,
  UserOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Leads.module.css';

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

  // Calcular estatísticas
  const stats = {
    total: leads.length,
    novos: leads.filter(l => l.status === 'novo').length,
    convertidos: leads.filter(l => l.status === 'convertido').length,
    emNegociacao: leads.filter(l => l.status === 'negociacao').length,
  };

  const conversionRate = stats.total > 0 ? ((stats.convertidos / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className={styles.leadsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <UserOutlined className={styles.titleIcon} />
            Gerenciar Leads
          </h1>
          <p className={styles.subtitle}>Acompanhe e gerencie seus contatos comerciais</p>
        </div>
        <div className={styles.headerBadge}>
          <TrophyOutlined /> {stats.convertidos} Conversões
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statIcon}>
              <UserOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total de Leads</p>
              <h2 className={styles.statValue}>{stats.total}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGold}`}>
            <div className={styles.statIcon}>
              <FireOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Novos Leads</p>
              <h2 className={styles.statValue}>{stats.novos}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardPurple}`}>
            <div className={styles.statIcon}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Em Negociação</p>
              <h2 className={styles.statValue}>{stats.emNegociacao}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statIcon}>
              <RiseOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Taxa de Conversão</p>
              <h2 className={styles.statValue}>{conversionRate}%</h2>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filtro */}
      <div className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <FilterOutlined /> Filtrar por Status
        </div>
        <Select
          placeholder="Todos os status"
          style={{ width: '100%' }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          className={styles.filterSelect}
        >
          <Option value="novo">Novo</Option>
          <Option value="contatado">Contatado</Option>
          <Option value="visitaAgendada">Visita Agendada</Option>
          <Option value="negociacao">Negociação</Option>
          <Option value="convertido">Convertido</Option>
          <Option value="perdido">Perdido</Option>
        </Select>
      </div>

      {/* Lista de Leads em Cards */}
      <div className={styles.leadsGrid}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
          </div>
        ) : leads.length === 0 ? (
          <Card className={styles.emptyCard}>
            <div className={styles.emptyState}>
              <UserOutlined className={styles.emptyIcon} />
              <h3>Nenhum lead encontrado</h3>
              <p>Os leads aparecerão aqui quando forem cadastrados</p>
            </div>
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {leads.map((lead) => (
              <Col xs={24} md={12} lg={8} key={lead.id}>
                <Card className={styles.leadCard}>
                  <div className={styles.leadHeader}>
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      className={styles.leadAvatar}
                    />
                    <div className={styles.leadHeaderInfo}>
                      <h3 className={styles.leadName}>{lead.nome}</h3>
                      <span className={styles.leadId}>ID: #{lead.id}</span>
                    </div>
                  </div>

                  <div className={styles.leadInfo}>
                    <div className={styles.infoItem}>
                      <MailOutlined className={styles.infoIcon} />
                      <span className={styles.infoText}>{lead.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <PhoneOutlined className={styles.infoIcon} />
                      <span className={styles.infoText}>{lead.telefone}</span>
                    </div>
                    {lead.mensagem && (
                      <div className={styles.messageBox}>
                        <p className={styles.messageLabel}>Mensagem:</p>
                        <p className={styles.messageText}>{lead.mensagem}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.leadMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Origem:</span>
                      <Tag color="blue">{lead.origem || 'Site'}</Tag>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Data:</span>
                      <span className={styles.metaValue}>{formatDate(lead.created_at)}</span>
                    </div>
                  </div>

                  <div className={styles.statusSection}>
                    <span className={styles.statusLabel}>Status:</span>
                    <Select
                      value={lead.status}
                      onChange={(newStatus) => handleUpdateStatus(lead.id, newStatus)}
                      className={styles.statusSelect}
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
                  </div>

                  <div className={styles.leadActions}>
                    <Button
                      type="primary"
                      icon={<PhoneOutlined />}
                      href={`tel:${lead.telefone}`}
                      className={styles.actionButton}
                    >
                      Ligar
                    </Button>
                    <Button
                      className={styles.whatsappButton}
                      icon={<WhatsAppOutlined />}
                      href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(lead.id)}
                      className={styles.deleteButton}
                    >
                      Excluir
                    </Button>
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

export default LeadsAdmin;
