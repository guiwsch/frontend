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
import "./styles/global.css";

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: "#1a2332",
          colorLink: "#60a5fa",
          borderRadius: 8,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        },
      }}
    >
      <Router>
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
