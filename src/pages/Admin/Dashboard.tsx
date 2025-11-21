import { Card, Row, Col, Typography, Statistic, Spin } from 'antd';
import { HomeOutlined, UserOutlined, CalendarOutlined, RiseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const { Title } = Typography;

interface Stats {
  total_imoveis: number;
  total_leads: number;
  visitas_agendadas: number;
  conversoes: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    total_imoveis: 0,
    total_leads: 0,
    visitas_agendadas: 0,
    conversoes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Carregando estatísticas..." />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Title level={1} className={styles.title}>Dashboard</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Total de Imóveis"
              value={stats.total_imoveis}
              prefix={<HomeOutlined className={styles.iconGreen} />}
              valueStyle={{ color: '#00b894', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Leads"
              value={stats.total_leads}
              prefix={<UserOutlined className={styles.iconBlue} />}
              valueStyle={{ color: '#0984e3', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Visitas Agendadas"
              value={stats.visitas_agendadas}
              prefix={<CalendarOutlined className={styles.iconGold} />}
              valueStyle={{ color: '#d4af37', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Conversões"
              value={stats.conversoes}
              prefix={<RiseOutlined className={styles.iconOrange} />}
              valueStyle={{ color: '#fdcb6e', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
