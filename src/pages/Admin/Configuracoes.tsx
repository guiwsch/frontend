import { Typography, Card, Form, Input, Button, Row, Col, Divider, Switch, message, Spin } from 'antd';
import { SaveOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Configuracoes.module.css';

const { Title } = Typography;
const { TextArea } = Input;

interface ConfigValues {
  nome_empresa: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  site?: string;
  sobre?: string;
  notificacao_email: boolean;
  notificacao_sms: boolean;
  notificacao_whatsapp: boolean;
}

const Configuracoes = () => {
  const [form] = Form.useForm<ConfigValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/api/admin/configuracoes/');
        form.setFieldsValue(response.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          message.info('Configure as informações da imobiliária pela primeira vez');
        } else {
          console.error('Erro ao carregar configurações:', error);
          message.error('Erro ao carregar configurações');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [form]);

  const onFinish = async (values: ConfigValues) => {
    setSaving(true);
    try {
      await api.put('/api/admin/configuracoes/', values);
      message.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      message.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Carregando configurações..." />
      </div>
    );
  }

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
            notificacao_email: true,
            notificacao_sms: false,
            notificacao_whatsapp: true
          }}
        >
          <Title level={3} className={styles.sectionTitle}>
            Informações da Imobiliária
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nome da Imobiliária"
                name="nome_empresa"
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
                label="Notificações por E-mail"
                name="notificacao_email"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Notificações por SMS"
                name="notificacao_sms"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Notificações por WhatsApp"
                name="notificacao_whatsapp"
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
              loading={saving}
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
