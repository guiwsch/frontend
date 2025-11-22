import { Typography, Form, Input, Select, InputNumber, Button, Row, Col, Card, message, Upload, Checkbox, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useImovel } from '../../context/ImovelContext';
import api from '../../services/api';
import styles from './ImovelForm.module.css';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ImovelFormValues {
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  preco: number;
  area: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  piscina: boolean;
  aceita_pets: boolean;
  mobiliado: boolean;
  destaque: boolean;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

const ImovelForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ImovelFormValues>();
  const { createImovel } = useImovel();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isEditMode = !!id;

  // Carregar dados do imóvel em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      loadImovelData(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadImovelData = async (imovelId: number) => {
    setLoadingData(true);
    try {
      const response = await api.get(`/api/imoveis/${imovelId}/`);
      const imovel = response.data;

      // Mapear os dados do backend para o formato do formulário
      form.setFieldsValue({
        titulo: imovel.titulo,
        descricao: imovel.descricao,
        tipo: imovel.tipo_imovel,
        status: imovel.tipo_negocio,
        preco: imovel.tipo_negocio === 'venda' || imovel.tipo_negocio === 'vendido'
          ? imovel.preco_venda
          : imovel.valor_aluguel,
        area: imovel.area_total,
        quartos: imovel.quartos,
        banheiros: imovel.banheiros,
        vagas: imovel.vagas_garagem,
        piscina: imovel.piscina,
        aceita_pets: imovel.aceita_pets,
        mobiliado: imovel.mobiliado,
        destaque: imovel.destaque,
        endereco: {
          rua: imovel.rua,
          numero: imovel.numero,
          complemento: imovel.complemento,
          bairro: imovel.bairro,
          cidade: imovel.cidade,
          estado: imovel.estado,
          cep: imovel.cep,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar imóvel:', error);
      message.error('Erro ao carregar dados do imóvel');
      navigate('/admin/imoveis');
    } finally {
      setLoadingData(false);
    }
  };

  const uploadImages = async (imovelId: number) => {
    const token = localStorage.getItem('access_token');

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append('file', file.originFileObj as Blob);
      formData.append('ordem', i.toString());
      formData.append('principal', (i === 0).toString());

      try {
        const response = await fetch(`http://localhost:8000/api/imoveis/${imovelId}/upload_imagem/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Erro ao fazer upload da imagem ${i + 1}`);
        }
      } catch (error) {
        console.error(`Erro ao fazer upload da imagem ${i + 1}:`, error);
        throw error;
      }
    }
  };

  const onFinish = async (values: ImovelFormValues) => {
    console.log('Form values:', values);
    setLoading(true);
    try {
      // Mapear os campos do formulário para o formato esperado pelo backend
      const imovelData = {
        titulo: values.titulo,
        descricao: values.descricao,
        tipo_imovel: values.tipo,
        tipo_negocio: values.status,
        preco_venda: values.status === 'venda' || values.status === 'vendido' ? values.preco : 0,
        valor_aluguel: values.status === 'aluguel' || values.status === 'alugado' ? values.preco : 0,
        area_total: values.area,
        area_construida: values.area, // Assumindo que são iguais por enquanto
        quartos: values.quartos,
        banheiros: values.banheiros,
        vagas_garagem: values.vagas,
        rua: values.endereco.rua,
        numero: values.endereco.numero,
        complemento: values.endereco.complemento || '',
        bairro: values.endereco.bairro,
        cidade: values.endereco.cidade,
        estado: values.endereco.estado,
        cep: values.endereco.cep,
        piscina: values.piscina || false,
        aceita_pets: values.aceita_pets || false,
        mobiliado: values.mobiliado || false,
        destaque: values.destaque || false
      };

      console.log('Dados enviados para API:', imovelData);

      let imovelId: number;

      if (isEditMode && id) {
        // Modo de edição
        await api.put(`/api/imoveis/${id}/`, imovelData);
        imovelId = parseInt(id);

        // Fazer upload das imagens se houver
        if (fileList.length > 0) {
          await uploadImages(imovelId);
          message.success('Imóvel atualizado com sucesso e imagens enviadas!');
        } else {
          message.success('Imóvel atualizado com sucesso!');
        }
      } else {
        // Modo de criação
        const novoImovel = await createImovel(imovelData);
        imovelId = novoImovel?.id;

        // Fazer upload das imagens se houver
        if (fileList.length > 0 && imovelId) {
          await uploadImages(imovelId);
          message.success('Imóvel criado com sucesso e imagens enviadas!');
        } else {
          message.success('Imóvel criado com sucesso!');
        }
      }

      navigate('/admin/imoveis');
    } catch (error) {
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} imóvel:`, error);
      message.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} imóvel. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.formContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <Title level={1} className={styles.title}>
          {isEditMode ? 'Editar Imóvel' : 'Novo Imóvel'}
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/imoveis')}
        >
          Voltar
        </Button>
      </div>

      <Card className={styles.formCard}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Title level={3} className={styles.sectionTitle}>Informações Básicas</Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Título"
                name="titulo"
                rules={[{ required: true, message: 'Por favor, insira o título' }]}
              >
                <Input placeholder="Ex: Casa 3 quartos no Centro" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Tipo"
                name="tipo"
                rules={[{ required: true, message: 'Selecione o tipo' }]}
              >
                <Select placeholder="Selecione">
                  <Option value="casa">Casa</Option>
                  <Option value="apartamento">Apartamento</Option>
                  <Option value="terreno">Terreno</Option>
                  <Option value="comercial">Comercial</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Selecione o status' }]}
              >
                <Select placeholder="Selecione">
                  <Option value="venda">Venda</Option>
                  <Option value="aluguel">Aluguel</Option>
                  <Option value="vendido">Vendido</Option>
                  <Option value="alugado">Alugado</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Descrição"
                name="descricao"
                rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
              >
                <TextArea rows={4} placeholder="Descreva o imóvel em detalhes" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={3} className={styles.sectionTitle}>Características</Title>
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                label="Preço (R$)"
                name="preco"
                rules={[{ required: true, message: 'Insira o preço' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/R\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="Área (m²)"
                name="area"
                rules={[{ required: true, message: 'Insira a área' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="Quartos"
                name="quartos"
                rules={[{ required: true, message: 'Insira os quartos' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="Banheiros"
                name="banheiros"
                rules={[{ required: true, message: 'Insira os banheiros' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="Vagas"
                name="vagas"
                rules={[{ required: true, message: 'Insira as vagas' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={3} className={styles.sectionTitle}>Características Adicionais</Title>
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                name="piscina"
                valuePropName="checked"
              >
                <Checkbox>Piscina</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="aceita_pets"
                valuePropName="checked"
              >
                <Checkbox>Aceita Pets</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="mobiliado"
                valuePropName="checked"
              >
                <Checkbox>Mobiliado</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="destaque"
                valuePropName="checked"
              >
                <Checkbox>Destacar Imóvel</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Title level={3} className={styles.sectionTitle}>Imagens</Title>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Fotos do Imóvel"
                extra="A primeira imagem será a foto principal"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                  beforeUpload={() => false}
                  multiple
                  accept="image/*"
                >
                  {fileList.length >= 8 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Title level={3} className={styles.sectionTitle}>Endereço</Title>
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                label="Rua"
                name={['endereco', 'rua']}
                rules={[{ required: true, message: 'Insira a rua' }]}
              >
                <Input placeholder="Nome da rua" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="Número"
                name={['endereco', 'numero']}
                rules={[{ required: true, message: 'Insira o número' }]}
              >
                <Input placeholder="Nº" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                label="CEP"
                name={['endereco', 'cep']}
                rules={[{ required: true, message: 'Insira o CEP' }]}
              >
                <Input placeholder="00000-000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Complemento"
                name={['endereco', 'complemento']}
              >
                <Input placeholder="Apto, Bloco, etc" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Bairro"
                name={['endereco', 'bairro']}
                rules={[{ required: true, message: 'Insira o bairro' }]}
              >
                <Input placeholder="Bairro" />
              </Form.Item>
            </Col>
            <Col xs={16} md={6}>
              <Form.Item
                label="Cidade"
                name={['endereco', 'cidade']}
                rules={[{ required: true, message: 'Insira a cidade' }]}
              >
                <Input placeholder="Cidade" />
              </Form.Item>
            </Col>
            <Col xs={8} md={2}>
              <Form.Item
                label="Estado"
                name={['endereco', 'estado']}
                rules={[{ required: true, message: 'UF' }]}
              >
                <Input placeholder="UF" maxLength={2} />
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
              loading={loading}
            >
              {isEditMode ? 'Atualizar Imóvel' : 'Salvar Imóvel'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ImovelForm;
