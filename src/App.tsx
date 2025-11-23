import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import "react-toastify/dist/ReactToastify.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "antd/dist/reset.css";

import { AuthProvider } from "./context/AuthContext";
import { ImovelProvider } from "./context/ImovelContext";
import AppRoutes from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import "./styles/global.css";

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: "#0f4c81",
          colorLink: "#d4af37",
          colorSuccess: "#10b981",
          colorInfo: "#0ea5e9",
          borderRadius: 12,
          colorBgContainer: "#ffffff",
          colorBorder: "#e2e8f0",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        },
        components: {
          Button: {
            primaryShadow: "0 4px 12px rgba(15, 76, 129, 0.3)",
          },
          Input: {
            hoverBorderColor: "#0f4c81",
            activeBorderColor: "#0f4c81",
          },
          Select: {
            optionSelectedBg: "#e0f2fe",
          },
        },
      }}
    >
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <ImovelProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </ImovelProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
