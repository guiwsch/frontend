import { Card, Row, Col, Typography, Statistic, Spin, Table, Tag, List, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, CalendarOutlined, RiseOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const { Title } = Typography;

interface Stats {
  total_imoveis: number;
  total_leads: number;
  visitas_agendadas: number;
  conversoes: number;
}

interface Activity {
  id: number;
  tipo: string;
  descricao: string;
  data: string;
  status: 'sucesso' | 'pendente' | 'cancelado';
}

interface ImovelDestaque {
  id: number;
  titulo: string;
  tipo: string;
  valor: number;
  visitas: number;
  leads: number;
  imagem?: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    total_imoveis: 0,
    total_leads: 0,
    visitas_agendadas: 0,
    conversoes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState<Activity[]>([]);
  const [imoveisDestaque, setImoveisDestaque] = useState<ImovelDestaque[]>([]);

  // Dados para gráficos (simulados - depois conectar com API)
  const dadosLeadsMes = [
    { mes: 'Jan', leads: 45, conversoes: 12 },
    { mes: 'Fev', leads: 52, conversoes: 15 },
    { mes: 'Mar', leads: 61, conversoes: 18 },
    { mes: 'Abr', leads: 58, conversoes: 16 },
    { mes: 'Mai', leads: 73, conversoes: 22 },
    { mes: 'Jun', leads: 89, conversoes: 28 },
  ];

  const dadosImovelTipo = [
    { tipo: 'Casas', quantidade: 15 },
    { tipo: 'Apartamentos', quantidade: 28 },
    { tipo: 'Terrenos', quantidade: 8 },
    { tipo: 'Comercial', quantidade: 5 },
  ];

  const COLORS = ['#00b894', '#0984e3', '#d4af37', '#fdcb6e'];

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

    // Dados simulados de atividades recentes
    setAtividades([
      { id: 1, tipo: 'Lead', descricao: 'Novo lead para Casa no Centro', data: '2 horas atrás', status: 'sucesso' },
      { id: 2, tipo: 'Visita', descricao: 'Visita agendada - Apt Vila Nova', data: '5 horas atrás', status: 'pendente' },
      { id: 3, tipo: 'Conversão', descricao: 'Venda concluída - Terreno', data: '1 dia atrás', status: 'sucesso' },
      { id: 4, tipo: 'Lead', descricao: 'Contato via WhatsApp', data: '1 dia atrás', status: 'sucesso' },
      { id: 5, tipo: 'Visita', descricao: 'Visita cancelada - Cliente', data: '2 dias atrás', status: 'cancelado' },
    ]);

    // Dados simulados de imóveis em destaque
    setImoveisDestaque([
      { id: 1, titulo: 'Casa no Centro', tipo: 'Casa', valor: 450000, visitas: 125, leads: 12 },
      { id: 2, titulo: 'Apto Vila Nova', tipo: 'Apartamento', valor: 280000, visitas: 98, leads: 8 },
      { id: 3, titulo: 'Terreno Industrial', tipo: 'Terreno', valor: 320000, visitas: 76, leads: 6 },
    ]);

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Carregando estatísticas..." />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircleOutlined style={{ color: '#00b894' }} />;
      case 'pendente':
        return <ClockCircleOutlined style={{ color: '#d4af37' }} />;
      case 'cancelado':
        return <CloseCircleOutlined style={{ color: '#d63031' }} />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      sucesso: { color: 'success', text: 'Sucesso' },
      pendente: { color: 'warning', text: 'Pendente' },
      cancelado: { color: 'error', text: 'Cancelado' },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div className={styles.dashboardContainer}>
      <Title level={1} className={styles.title}>Dashboard</Title>

      {/* Cards de Estatísticas */}
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

      {/* Gráficos */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card className={styles.card} title="Leads e Conversões (Últimos 6 Meses)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosLeadsMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#0984e3" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="conversoes" stroke="#00b894" strokeWidth={2} name="Conversões" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className={styles.card} title="Imóveis por Tipo">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosImovelTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {dadosImovelTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Atividades Recentes e Imóveis em Destaque */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card className={styles.card} title="Atividades Recentes">
            <List
              dataSource={atividades}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getStatusIcon(item.status)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>{item.tipo}:</strong> {item.descricao}</span>
                        {getStatusTag(item.status)}
                      </div>
                    }
                    description={item.data}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className={styles.card} title="Imóveis em Destaque">
            <List
              dataSource={imoveisDestaque}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<HomeOutlined />} style={{ backgroundColor: '#0984e3' }} />}
                    title={<strong>{item.titulo}</strong>}
                    description={
                      <div>
                        <div><Tag color="blue">{item.tipo}</Tag> R$ {item.valor.toLocaleString('pt-BR')}</div>
                        <div style={{ marginTop: 8 }}>
                          <EyeOutlined /> {item.visitas} visitas • <UserOutlined /> {item.leads} leads
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
