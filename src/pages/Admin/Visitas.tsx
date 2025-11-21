import { Typography, Calendar, Badge, Card, List, Tag, Space, Button, Modal, message, Select } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, HomeOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import api from '../../services/api';
import styles from './Visitas.module.css';

const { Title } = Typography;
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
      <ul className={styles.events}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
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

  return (
    <div className={styles.visitasContainer}>
      <Title level={1} className={styles.title}>Gerenciar Visitas</Title>

      <div className={styles.content}>
        <Card className={styles.calendarCard} title="Calendário de Visitas">
          <Calendar cellRender={dateCellRender} />
        </Card>

        <Card className={styles.listCard} title="Próximas Visitas" loading={loading}>
          {proximasVisitas.length === 0 ? (
            <div className={styles.emptyState}>
              <CalendarOutlined className={styles.emptyIcon} />
              <p>Nenhuma visita agendada</p>
            </div>
          ) : (
            <List
              dataSource={proximasVisitas}
              renderItem={(visita) => (
                <List.Item
                  actions={[
                    <Select
                      value={visita.status}
                      onChange={(newStatus) => handleUpdateStatus(visita.id, newStatus)}
                      style={{ width: 120 }}
                      size="small"
                    >
                      <Option value="agendada">Agendada</Option>
                      <Option value="confirmada">Confirmada</Option>
                      <Option value="realizada">Realizada</Option>
                      <Option value="cancelada">Cancelada</Option>
                    </Select>,
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      title="Excluir"
                      onClick={() => handleDelete(visita.id)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CalendarOutlined className={styles.listIcon} />}
                    title={
                      <Space>
                        <span>{formatDateTime(visita.data_hora)}</span>
                        <Tag color={getStatusColor(visita.status)}>
                          {getStatusText(visita.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <span><UserOutlined /> Cliente: {visita.nome_cliente}</span>
                        <span><HomeOutlined /> Imóvel ID: {visita.imovel_id}</span>
                        <span>📞 {visita.telefone_cliente}</span>
                        {visita.observacoes && <span>💬 {visita.observacoes}</span>}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default VisitasAdmin;
