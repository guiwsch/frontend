import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    const result = await login(values.username, values.password);

    if (result.success) {
      toast.success('Bem-vindo de volta! 🎉');
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } else {
      toast.error(result.error || 'Credenciais inválidas');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Animated Background Particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
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

        {/* Right Side - Login Form */}
        <div className={styles.formSide}>
          <Card className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.formTitle}>Acesso Administrativo</h2>
              <p className={styles.formSubtitle}>
                Entre com suas credenciais para continuar
              </p>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Por favor, insira seu usuário' },
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
                name="password"
                rules={[
                  { required: true, message: 'Por favor, insira sua senha' },
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
                    'Entrar no Sistema'
                  )}
                </Button>
              </Form.Item>

              {/* <div className={styles.registerLink}>
                <span>Não tem uma conta? </span>
                <a href="/register" onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}>
                  Criar conta
                </a>
              </div> */}
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

export default Login;
