import { Typography, Calendar, Badge, Card, List, Tag, Space, Button } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, HomeOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import styles from './Visitas.module.css';

const { Title } = Typography;

interface Visita {
  id: string;
  data: string;
  horario: string;
  cliente: string;
  imovel: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada';
}

const VisitasAdmin = () => {
  const visitas: Visita[] = [];

  const getListData = (value: Dayjs) => {
    // Aqui você buscaria as visitas para a data específica
    return [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className={styles.events}>
        {listData.map((item: any) => (
          <li key={item.id}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const getStatusColor = (status: Visita['status']) => {
    const colors = {
      agendada: 'blue',
      confirmada: 'green',
      realizada: 'success',
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

  return (
    <div className={styles.visitasContainer}>
      <Title level={1} className={styles.title}>Gerenciar Visitas</Title>

      <div className={styles.content}>
        <Card className={styles.calendarCard} title="Calendário de Visitas">
          <Calendar cellRender={dateCellRender} />
        </Card>

        <Card className={styles.listCard} title="Próximas Visitas">
          {visitas.length === 0 ? (
            <div className={styles.emptyState}>
              <CalendarOutlined className={styles.emptyIcon} />
              <p>Nenhuma visita agendada</p>
            </div>
          ) : (
            <List
              dataSource={visitas}
              renderItem={(visita) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      title="Confirmar"
                    />,
                    <Button
                      type="link"
                      danger
                      icon={<CloseCircleOutlined />}
                      title="Cancelar"
                    />
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CalendarOutlined className={styles.listIcon} />}
                    title={
                      <Space>
                        <span>{visita.data}</span>
                        <ClockCircleOutlined />
                        <span>{visita.horario}</span>
                        <Tag color={getStatusColor(visita.status)}>
                          {getStatusText(visita.status)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <span><UserOutlined /> Cliente: {visita.cliente}</span>
                        <span><HomeOutlined /> Imóvel: {visita.imovel}</span>
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
