import { useEffect } from "react";
import { useImovel } from "../../../context/ImovelContext";
import HeroSection from "./components/HeroSection";
import Destaques from "./components/Destaques";
import Categorias from "./components/Categorias";
import Diferenciais from "./components/Diferenciais";
import CallToAction from "./components/CallToAction";

const Home = () => {
  const { fetchDestaques } = useImovel();

  useEffect(() => {
    fetchDestaques();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <HeroSection />
      <Destaques />
      <Categorias />
      <Diferenciais />
      <CallToAction />
    </div>
  );
};

export default Home;
