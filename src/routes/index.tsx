import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";
import { Spin } from "antd";

// Layouts
import PublicLayout from "../components/layouts/PublicLayout";
import AdminLayout from "../components/layouts/AdminLayout";

// Páginas Públicas
import Home from "../pages/Public/Home";
import ImovelListagem from "../pages/Public/ImovelListagem";
import ImovelDetalhes from "../pages/Public/ImovelDetalhes";
import Sobre from "../pages/Public/Sobre";
import Contato from "../pages/Public/Contato";

// Páginas Admin
import Login from "../pages/Admin/Login";
import Register from "../pages/Admin/Register";
import Dashboard from "../pages/Admin/Dashboard";
import ImoveisAdmin from "../pages/Admin/Imoveis";
import ImovelForm from "../pages/Admin/ImovelForm";
import LeadsAdmin from "../pages/Admin/Leads";
import VisitasAdmin from "../pages/Admin/Visitas";
import Configuracoes from "../pages/Admin/Configuracoes";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<ImovelListagem />} />
        <Route path="/imoveis/:id" element={<ImovelDetalhes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
      </Route>

      {/* Login e Registro */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas Admin (Protegidas) */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="imoveis" element={<ImoveisAdmin />} />
        <Route path="imoveis/novo" element={<ImovelForm />} />
        <Route path="imoveis/editar/:id" element={<ImovelForm />} />
        <Route path="leads" element={<LeadsAdmin />} />
        <Route path="visitas" element={<VisitasAdmin />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
