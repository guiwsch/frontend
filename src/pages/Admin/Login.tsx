import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import styles from './Login.module.css';

const { Title, Text } = Typography;

interface Credentials {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials.username, credentials.password);

    if (result.success) {
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginBox}>
        <Title level={1} className={styles.logo}>
          Imobi<span className={styles.logoAccent}>Lux</span>
        </Title>
        <Text className={styles.subtitle}>Painel Administrativo</Text>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Usuário</label>
            <Input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              autoFocus
              size="large"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <Input.Password
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              size="large"
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className={styles.submitButton}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
