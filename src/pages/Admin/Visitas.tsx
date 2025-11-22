import { Card, Row, Col, Calendar, Badge, Tag, Button, Modal, message, Select, Avatar } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  UserOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import api from '../../services/api';
import styles from './Visitas.module.css';

const { confirm } = Modal;
const { Option } = Select;

interface Visita {
  id: number;
  imovel_id: number;
  lead_id?: number;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
  data_hora: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada';
  observacoes?: string;
  created_at: string;
  updated_at?: string;
}

const VisitasAdmin = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/visitas/');
      setVisitas(response.data);
    } catch (error) {
      console.error('Erro ao buscar visitas:', error);
      message.error('Erro ao carregar visitas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleUpdateStatus = async (visitaId: number, newStatus: string) => {
    try {
      await api.put(`/api/admin/visitas/${visitaId}/`, { status: newStatus });
      message.success('Status atualizado com sucesso!');
      fetchVisitas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      message.error('Erro ao atualizar status');
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Tem certeza que deseja excluir esta visita?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      async onOk() {
        try {
          await api.delete(`/api/admin/visitas/${id}/`);
          message.success('Visita excluída com sucesso!');
          fetchVisitas();
        } catch (error) {
          console.error('Erro ao excluir visita:', error);
          message.error('Erro ao excluir visita');
        }
      },
    });
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    return visitas
      .filter(v => dayjs(v.data_hora).format('YYYY-MM-DD') === dateStr)
      .map(v => ({
        type: v.status === 'confirmada' ? 'success' : v.status === 'cancelada' ? 'error' : 'warning',
        content: `${dayjs(v.data_hora).format('HH:mm')} - ${v.nome_cliente}`,
      }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <div className={styles.dateContent}>
        <ul className={styles.events}>
          {listData.map((item, index) => (
            <li key={index}>
              <Badge status={item.type as any} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const fullCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    const hasEvents = listData.length > 0;

    return (
      <div className={`${styles.calendarCell} ${hasEvents ? styles.hasEvents : ''}`}>
        <div className={styles.dateNumber}>{value.date()}</div>
        {dateCellRender(value)}
      </div>
    );
  };

  const getStatusColor = (status: Visita['status']) => {
    const colors = {
      agendada: 'blue',
      confirmada: 'green',
      realizada: 'cyan',
      cancelada: 'red'
    };
    return colors[status];
  };

  const getStatusText = (status: Visita['status']) => {
    const texts = {
      agendada: 'Agendada',
      confirmada: 'Confirmada',
      realizada: 'Realizada',
      cancelada: 'Cancelada'
    };
    return texts[status];
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Filtra apenas visitas futuras ou do dia atual e ordena por data
  const proximasVisitas = visitas
    .filter(v => dayjs(v.data_hora).isAfter(dayjs().startOf('day')))
    .sort((a, b) => dayjs(a.data_hora).diff(dayjs(b.data_hora)));

  // Calcular estatísticas
  const stats = {
    total: proximasVisitas.length,
    agendadas: proximasVisitas.filter(v => v.status === 'agendada').length,
    confirmadas: proximasVisitas.filter(v => v.status === 'confirmada').length,
    hoje: proximasVisitas.filter(v =>
      dayjs(v.data_hora).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
    ).length,
  };

  return (
    <div className={styles.visitasContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <CalendarOutlined className={styles.titleIcon} />
            Gerenciar Visitas
          </h1>
          <p className={styles.subtitle}>Agende e acompanhe as visitas aos imóveis</p>
        </div>
        <div className={styles.headerBadge}>
          <TrophyOutlined /> {stats.hoje} Visitas Hoje
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statIcon}>
              <CalendarOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Próximas Visitas</p>
              <h2 className={styles.statValue}>{stats.total}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGold}`}>
            <div className={styles.statIcon}>
              <ClockCircleOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Agendadas</p>
              <h2 className={styles.statValue}>{stats.agendadas}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statIcon}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Confirmadas</p>
              <h2 className={styles.statValue}>{stats.confirmadas}</h2>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardOrange}`}>
            <div className={styles.statIcon}>
              <FireOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Visitas Hoje</p>
              <h2 className={styles.statValue}>{stats.hoje}</h2>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Content */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={14}>
          <Card className={styles.calendarCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <CalendarOutlined /> Calendário de Visitas
              </h3>
            </div>
            <Calendar
              fullCellRender={fullCellRender}
              className={styles.calendar}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className={styles.listCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <ClockCircleOutlined /> Próximas Visitas
              </h3>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
              </div>
            ) : proximasVisitas.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarOutlined className={styles.emptyIcon} />
                <h3>Nenhuma visita agendada</h3>
                <p>As visitas futuras aparecerão aqui</p>
              </div>
            ) : (
              <div className={styles.visitasList}>
                {proximasVisitas.map((visita) => (
                  <Card key={visita.id} className={styles.visitaCard}>
                    <div className={styles.visitaHeader}>
                      <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        className={styles.visitaAvatar}
                      />
                      <div className={styles.visitaHeaderInfo}>
                        <h4 className={styles.visitaCliente}>{visita.nome_cliente}</h4>
                        <span className={styles.visitaData}>
                          <CalendarOutlined /> {formatDateTime(visita.data_hora)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.visitaInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>
                          <HomeOutlined /> Imóvel:
                        </span>
                        <span className={styles.infoValue}>ID #{visita.imovel_id}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Telefone:</span>
                        <span className={styles.infoValue}>{visita.telefone_cliente}</span>
                      </div>
                      {visita.observacoes && (
                        <div className={styles.observacoes}>
                          <p className={styles.observacoesLabel}>Observações:</p>
                          <p className={styles.observacoesText}>{visita.observacoes}</p>
                        </div>
                      )}
                    </div>

                    <div className={styles.statusSection}>
                      <span className={styles.statusLabel}>Status:</span>
                      <Select
                        value={visita.status}
                        onChange={(newStatus) => handleUpdateStatus(visita.id, newStatus)}
                        className={styles.statusSelect}
                        size="small"
                      >
                        <Option value="agendada">
                          <Tag color="blue">Agendada</Tag>
                        </Option>
                        <Option value="confirmada">
                          <Tag color="green">Confirmada</Tag>
                        </Option>
                        <Option value="realizada">
                          <Tag color="cyan">Realizada</Tag>
                        </Option>
                        <Option value="cancelada">
                          <Tag color="red">Cancelada</Tag>
                        </Option>
                      </Select>
                    </div>

                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(visita.id)}
                      className={styles.deleteButton}
                      block
                    >
                      Excluir Visita
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VisitasAdmin;
