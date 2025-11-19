import { Typography, Card, Form, Input, Button, Row, Col, Divider, Switch } from 'antd';
import { SaveOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import styles from './Configuracoes.module.css';

const { Title } = Typography;
const { TextArea } = Input;

interface ConfigValues {
  nomeImobiliaria: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  site: string;
  sobre: string;
  notificacoes: {
    emailNovoLead: boolean;
    emailNovaVisita: boolean;
    smsLembreteVisita: boolean;
  };
}

const Configuracoes = () => {
  const [form] = Form.useForm<ConfigValues>();

  const onFinish = (values: ConfigValues) => {
    console.log('Configurações salvas:', values);
    // Aqui você implementaria a lógica para salvar as configurações
  };

  return (
    <div className={styles.configContainer}>
      <Title level={1} className={styles.title}>Configurações</Title>

      <Card className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            notificacoes: {
              emailNovoLead: true,
              emailNovaVisita: true,
              smsLembreteVisita: false
            }
          }}
        >
          <Title level={3} className={styles.sectionTitle}>
            Informações da Imobiliária
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nome da Imobiliária"
                name="nomeImobiliaria"
                rules={[{ required: true, message: 'Por favor, insira o nome' }]}
              >
                <Input placeholder="Ex: ImobiLux Imóveis" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  { required: true, message: 'Por favor, insira o e-mail' },
                  { type: 'email', message: 'E-mail inválido' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="contato@imobilux.com.br" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Telefone"
                name="telefone"
                rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="(00) 0000-0000" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="WhatsApp"
                name="whatsapp"
                rules={[{ required: true, message: 'Por favor, insira o WhatsApp' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="(00) 00000-0000" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Site"
                name="site"
              >
                <Input prefix={<GlobalOutlined />} placeholder="www.imobilux.com.br" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Endereço"
                name="endereco"
                rules={[{ required: true, message: 'Por favor, insira o endereço' }]}
              >
                <Input prefix={<EnvironmentOutlined />} placeholder="Rua, número, bairro, cidade - UF" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Sobre a Imobiliária"
                name="sobre"
              >
                <TextArea rows={4} placeholder="Descrição da imobiliária para o site" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={3} className={styles.sectionTitle}>
            Notificações
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="E-mail para novos leads"
                name={['notificacoes', 'emailNovoLead']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="E-mail para novas visitas"
                name={['notificacoes', 'emailNovaVisita']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="SMS de lembrete de visita"
                name={['notificacoes', 'smsLembreteVisita']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item className={styles.submitContainer}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className={styles.submitButton}
            >
              Salvar Configurações
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Configuracoes;
