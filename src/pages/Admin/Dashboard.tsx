import { Card, Row, Col, Typography, Statistic } from 'antd';
import { HomeOutlined, UserOutlined, CalendarOutlined, RiseOutlined } from '@ant-design/icons';
import styles from './Dashboard.module.css';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Title level={1} className={styles.title}>Dashboard</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Total de Imóveis"
              value={0}
              prefix={<HomeOutlined className={styles.iconGreen} />}
              valueStyle={{ color: '#00b894', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Leads"
              value={0}
              prefix={<UserOutlined className={styles.iconBlue} />}
              valueStyle={{ color: '#0984e3', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Visitas Agendadas"
              value={0}
              prefix={<CalendarOutlined className={styles.iconGold} />}
              valueStyle={{ color: '#d4af37', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.card}>
            <Statistic
              title="Conversões"
              value={0}
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
