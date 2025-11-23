import { Typography, Card, Form, Input, Button, Row, Col, Divider, Switch, message, Spin, Tabs, Modal, Avatar } from 'antd';
import {
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Configuracoes.module.css';

const { Title, Text } = Typography;
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

interface UserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const Configuracoes = () => {
  const navigate = useNavigate();
  const { logout, userProfile, fetchUserProfile, updateUserProfile } = useAuth();
  const [configForm] = Form.useForm<ConfigValues>();
  const [userForm] = Form.useForm<UserData>();
  const [passwordForm] = Form.useForm<PasswordData>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Carregar configurações da imobiliária
      try {
        const configResponse = await api.get('/api/admin/configuracoes/');
        configForm.setFieldsValue(configResponse.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          message.info('Configure as informações da imobiliária pela primeira vez');
        }
      }

      // Carregar dados do usuário
      try {
        await fetchUserProfile();
        if (userProfile) {
          userForm.setFieldsValue(userProfile);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      message.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza o formulário quando userProfile mudar
  useEffect(() => {
    if (userProfile) {
      userForm.setFieldsValue(userProfile);
    }
  }, [userProfile, userForm]);

  const onFinishConfig = async (values: ConfigValues) => {
    setSaving(true);
    try {
      await api.put('/api/admin/configuracoes/', values);
      message.success('Configurações da imobiliária salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      message.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const onFinishUser = async (values: UserData) => {
    setSaving(true);
    try {
      const success = await updateUserProfile(values);
      if (success) {
        message.success('Dados do usuário atualizados com sucesso!');
      } else {
        message.error('Erro ao atualizar dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      message.error('Erro ao atualizar dados do usuário');
    } finally {
      setSaving(false);
    }
  };

  const onFinishPassword = async (values: PasswordData) => {
    if (values.new_password !== values.confirm_password) {
      message.error('As senhas não coincidem!');
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/change-password/', {
        old_password: values.current_password,
        new_password: values.new_password,
      });
      message.success('Senha alterada com sucesso!');
      passwordForm.resetFields();
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      if (error.response?.status === 400) {
        message.error('Senha atual incorreta');
      } else {
        message.error('Erro ao alterar senha');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Sair do sistema',
      content: 'Tem certeza que deseja sair?',
      okText: 'Sim, sair',
      cancelText: 'Cancelar',
      okType: 'danger',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'empresa',
      label: (
        <span>
          <InfoCircleOutlined /> Empresa
        </span>
      ),
      children: (
        <Card className={styles.tabCard}>
          <Form
            form={configForm}
            layout="vertical"
            onFinish={onFinishConfig}
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
      ),
    },
    {
      key: 'perfil',
      label: (
        <span>
          <UserOutlined /> Meu Perfil
        </span>
      ),
      children: (
        <Row gutter={20}>
          <Col xs={24} lg={12}>
            <Card className={styles.tabCard}>
              <div className={styles.profileHeader}>
                <Avatar size={80} icon={<UserOutlined />} className={styles.avatar} />
                <div className={styles.profileInfo}>
                  <Title level={4} className={styles.profileName}>
                    {userProfile?.first_name} {userProfile?.last_name}
                  </Title>
                  <Text className={styles.profileEmail}>@{userProfile?.username}</Text>
                </div>
              </div>

              <Divider />

              <Form
                form={userForm}
                layout="vertical"
                onFinish={onFinishUser}
                autoComplete="off"
              >
                <Title level={4} className={styles.sectionTitle}>
                  Dados Pessoais
                </Title>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Nome"
                      name="first_name"
                      rules={[{ required: true, message: 'Insira seu nome' }]}
                    >
                      <Input placeholder="Nome" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Sobrenome"
                      name="last_name"
                      rules={[{ required: true, message: 'Insira seu sobrenome' }]}
                    >
                      <Input placeholder="Sobrenome" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Nome de Usuário"
                  name="username"
                  rules={[{ required: true, message: 'Insira seu nome de usuário' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="usuario" />
                </Form.Item>

                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    { required: true, message: 'Insira seu e-mail' },
                    { type: 'email', message: 'E-mail inválido' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
                </Form.Item>

                <Form.Item className={styles.submitContainer}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    className={styles.submitButton}
                    loading={saving}
                  >
                    Atualizar Perfil
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className={styles.tabCard}>
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={onFinishPassword}
                autoComplete="off"
              >
                <Title level={4} className={styles.sectionTitle}>
                  <KeyOutlined /> Alterar Senha
                </Title>

                <Form.Item
                  label="Senha Atual"
                  name="current_password"
                  rules={[{ required: true, message: 'Insira sua senha atual' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Senha atual" />
                </Form.Item>

                <Form.Item
                  label="Nova Senha"
                  name="new_password"
                  rules={[
                    { required: true, message: 'Insira a nova senha' },
                    { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nova senha" />
                </Form.Item>

                <Form.Item
                  label="Confirmar Nova Senha"
                  name="confirm_password"
                  dependencies={['new_password']}
                  rules={[
                    { required: true, message: 'Confirme a nova senha' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Confirme a nova senha" />
                </Form.Item>

                <Form.Item className={styles.submitContainer}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<KeyOutlined />}
                    size="large"
                    className={styles.submitButton}
                    loading={saving}
                  >
                    Alterar Senha
                  </Button>
                </Form.Item>
              </Form>

              <Divider />

              <div className={styles.dangerZone}>
                <Title level={5} className={styles.dangerTitle}>Zona de Perigo</Title>
                <Text className={styles.dangerText}>
                  Ao sair, você precisará fazer login novamente para acessar o sistema.
                </Text>
                <Button
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  block
                  size="large"
                  className={styles.logoutButton}
                >
                  Sair do Sistema
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'notificacoes',
      label: (
        <span>
          <BellOutlined /> Notificações
        </span>
      ),
      children: (
        <Card className={styles.tabCard}>
          <Form
            form={configForm}
            layout="vertical"
            onFinish={onFinishConfig}
            autoComplete="off"
          >
            <Title level={3} className={styles.sectionTitle}>
              <BellOutlined /> Preferências de Notificações
            </Title>

            <Text className={styles.notificationDesc}>
              Escolha como você deseja ser notificado sobre novos leads, visitas agendadas e outras atividades.
            </Text>

            <Divider />

            <Row gutter={[16, 24]}>
              <Col xs={24} md={8}>
                <Card className={styles.notificationCard}>
                  <div className={styles.notificationIcon}>
                    <MailOutlined />
                  </div>
                  <Title level={4}>E-mail</Title>
                  <Text>Receber notificações por e-mail</Text>
                  <Form.Item
                    name="notificacao_email"
                    valuePropName="checked"
                    className={styles.switchItem}
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card className={styles.notificationCard}>
                  <div className={styles.notificationIcon}>
                    <PhoneOutlined />
                  </div>
                  <Title level={4}>SMS</Title>
                  <Text>Receber notificações por SMS</Text>
                  <Form.Item
                    name="notificacao_sms"
                    valuePropName="checked"
                    className={styles.switchItem}
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card className={styles.notificationCard}>
                  <div className={styles.notificationIcon}>
                    <PhoneOutlined />
                  </div>
                  <Title level={4}>WhatsApp</Title>
                  <Text>Receber notificações via WhatsApp</Text>
                  <Form.Item
                    name="notificacao_whatsapp"
                    valuePropName="checked"
                    className={styles.switchItem}
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <Form.Item className={styles.submitContainer}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                className={styles.submitButton}
                loading={saving}
              >
                Salvar Preferências
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div className={styles.configContainer}>
      <div className={styles.header}>
        <div>
          <Title level={1} className={styles.title}>
            <SettingOutlined className={styles.titleIcon} />
            Configurações
          </Title>
          <Text className={styles.subtitle}>Gerencie as configurações do sistema</Text>
        </div>
      </div>

      <Tabs
        defaultActiveKey="empresa"
        items={tabItems}
        className={styles.tabs}
        size="large"
      />
    </div>
  );
};

export default Configuracoes;
