import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const PublicLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
