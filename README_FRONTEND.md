# Frontend - Site Imobiliária

## Tecnologias

- React 18
- Vite
- Styled Components
- Context API
- React Router DOM
- React Image Gallery
- Axios
- React Toastify
- React Icons

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo VITE_API_URL=http://localhost:8000 > .env

# Iniciar servidor de desenvolvimento
npm run dev
```

## Estrutura

```
src/
├── components/
│   ├── common/          # Header, Footer
│   └── layouts/         # PublicLayout, AdminLayout
├── context/             # AuthContext, ImovelContext
├── pages/
│   ├── Public/          # Home, Listagem, Detalhes, etc
│   └── Admin/           # Dashboard, CRUD, etc
├── routes/              # Configuração de rotas
├── services/            # API (Axios)
├── styles/              # GlobalStyles, theme
├── App.jsx
└── main.jsx
```

## Rotas

### Públicas
- `/` - Home
- `/imoveis` - Listagem
- `/imoveis/:id` - Detalhes
- `/sobre` - Sobre
- `/contato` - Contato

### Admin (Protegidas)
- `/login` - Login
- `/admin` - Dashboard
- `/admin/imoveis` - Lista de imóveis
- `/admin/imoveis/novo` - Novo imóvel
- `/admin/leads` - Gestão de leads
- `/admin/visitas` - Gestão de visitas
- `/admin/configuracoes` - Configurações

## Context API

### AuthContext
- `user` - Usuário atual
- `login(username, password)` - Fazer login
- `logout()` - Fazer logout
- `isAuthenticated()` - Verificar autenticação

### ImovelContext
- `imoveis` - Lista de imóveis
- `destaques` - Imóveis em destaque
- `fetchImoveis()` - Buscar imóveis
- `fetchDestaques()` - Buscar destaques
- `updateFiltros(filtros)` - Atualizar filtros

## Tema (Styled Components)

Cores principais:
- `primary`: #1a2332
- `secondary`: #d4af37
- `accent`: #00b894
- `background`: #f8f9fa

## Scripts

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview do build
npm run preview
```

## Componentes Principais

### Header
Navegação principal do site

### Footer
Rodapé com informações de contato

### HeroSection
Seção hero com busca de imóveis

### Destaques
Grid de imóveis em destaque

### Categorias
Cards de categorias (Comprar/Alugar)

## Build para Produção

```bash
npm run build
```

Os arquivos de produção estarão em `dist/`
