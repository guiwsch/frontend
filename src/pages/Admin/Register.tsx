import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined, RocketOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import styles from './Login.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setLoading(true);

    const result = await register({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      toast.error(result.error || 'Erro ao realizar cadastro');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Animated Background Particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Side - Branding */}
        <div className={styles.brandingSide}>
          <div className={styles.brandingContent}>
            <div className={styles.iconWrapper}>
              <RocketOutlined className={styles.brandIcon} />
            </div>
            <h1 className={styles.brandTitle}>
              Imobi<span className={styles.brandAccent}>Lux</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Sistema de Gestão Imobiliária
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <SafetyOutlined className={styles.featureIcon} />
                <span>Seguro e Confiável</span>
              </div>
              <div className={styles.feature}>
                <RocketOutlined className={styles.featureIcon} />
                <span>Rápido e Eficiente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className={styles.formSide}>
          <Card className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.formTitle}>Criar Nova Conta</h2>
              <p className={styles.formSubtitle}>Preencha os dados para se cadastrar</p>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Por favor, insira seu usuário' },
                  { min: 3, message: 'Usuário deve ter no mínimo 3 caracteres' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Usuário"
                  size="large"
                  className={styles.input}
                  autoFocus
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor, insira seu email' },
                  { type: 'email', message: 'Por favor, insira um email válido' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="Email"
                  size="large"
                  className={styles.input}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Por favor, insira sua senha' },
                  { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Senha"
                  size="large"
                  className={styles.input}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Por favor, confirme sua senha' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não coincidem'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Confirmar Senha"
                  size="large"
                  className={styles.input}
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <PulseLoader color="#000" size={8} margin={3} />
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </Form.Item>

              <div className={styles.registerLink}>
                <span>Já tem uma conta? </span>
                <a href="/login" onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}>
                  Entrar
                </a>
              </div>
            </Form>

            <div className={styles.footer}>
              <SafetyOutlined className={styles.footerIcon} />
              <span>Acesso protegido e criptografado</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
