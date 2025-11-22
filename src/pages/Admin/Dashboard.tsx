import { Card, Row, Col, Statistic, Tag, List, Avatar, Progress } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PulseLoader } from 'react-spinners';
import api from '../../services/api';
import styles from './Dashboard.module.css';

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
      <div className={styles.loadingContainer}>
        <PulseLoader color="#d4af37" size={15} margin={5} />
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
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <FireOutlined className={styles.titleIcon} />
            Dashboard
          </h1>
          <p className={styles.subtitle}>Visão geral do seu negócio imobiliário</p>
        </div>
        <div className={styles.headerBadge}>
          <TrophyOutlined /> Top Performance
        </div>
      </div>

      {/* Cards de Estatísticas Premium */}
      <Row gutter={[20, 20]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGreen}`}>
            <div className={styles.statIcon}>
              <HomeOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total de Imóveis</p>
              <h2 className={styles.statValue}>{stats.total_imoveis}</h2>
              <div className={styles.statTrend}>
                <ThunderboltOutlined /> +12% este mês
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardBlue}`}>
            <div className={styles.statIcon}>
              <UserOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Leads</p>
              <h2 className={styles.statValue}>{stats.total_leads}</h2>
              <div className={styles.statTrend}>
                <ThunderboltOutlined /> +28% este mês
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardGold}`}>
            <div className={styles.statIcon}>
              <CalendarOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Visitas Agendadas</p>
              <h2 className={styles.statValue}>{stats.visitas_agendadas}</h2>
              <div className={styles.statTrend}>
                <ThunderboltOutlined /> +8% este mês
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.statCard} ${styles.statCardOrange}`}>
            <div className={styles.statIcon}>
              <RiseOutlined />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Conversões</p>
              <h2 className={styles.statValue}>{stats.conversoes}</h2>
              <div className={styles.statTrend}>
                <ThunderboltOutlined /> +35% este mês
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gráficos Modernos */}
      <Row gutter={[20, 20]} className={styles.chartsRow}>
        <Col xs={24} lg={16}>
          <Card className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <RiseOutlined /> Leads e Conversões
              </h3>
              <Tag color="gold">Últimos 6 Meses</Tag>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={dadosLeadsMes}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0984e3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0984e3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="conversoesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b894" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00b894" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mes" stroke="#b8b8b8" />
                <YAxis stroke="#b8b8b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#0984e3" strokeWidth={3} dot={{ fill: '#0984e3', r: 5 }} name="Leads" fill="url(#leadsGradient)" />
                <Line type="monotone" dataKey="conversoes" stroke="#00b894" strokeWidth={3} dot={{ fill: '#00b894', r: 5 }} name="Conversões" fill="url(#conversoesGradient)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <HomeOutlined /> Imóveis por Tipo
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={dadosImovelTipo}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                >
                  {dadosImovelTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Atividades e Imóveis em Destaque */}
      <Row gutter={[20, 20]} className={styles.listsRow}>
        <Col xs={24} lg={12}>
          <Card className={styles.activityCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <ClockCircleOutlined /> Atividades Recentes
              </h3>
            </div>
            <List
              className={styles.activityList}
              dataSource={atividades}
              renderItem={(item) => (
                <List.Item className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityType}>{item.tipo}:</span>
                      <span className={styles.activityDesc}>{item.descricao}</span>
                      {getStatusTag(item.status)}
                    </div>
                    <div className={styles.activityTime}>{item.data}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className={styles.propertyCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <TrophyOutlined /> Imóveis em Destaque
              </h3>
            </div>
            <List
              className={styles.propertyList}
              dataSource={imoveisDestaque}
              renderItem={(item) => (
                <List.Item className={styles.propertyItem}>
                  <div className={styles.propertyIcon}>
                    <Avatar icon={<HomeOutlined />} size={48} className={styles.propertyAvatar} />
                  </div>
                  <div className={styles.propertyContent}>
                    <h4 className={styles.propertyTitle}>{item.titulo}</h4>
                    <div className={styles.propertyMeta}>
                      <Tag color="blue">{item.tipo}</Tag>
                      <span className={styles.propertyPrice}>R$ {item.valor.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className={styles.propertyStats}>
                      <span><EyeOutlined /> {item.visitas}</span>
                      <span><UserOutlined /> {item.leads}</span>
                      <Progress percent={Math.round((item.leads / item.visitas) * 100)} size="small" strokeColor="#d4af37" />
                    </div>
                  </div>
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
