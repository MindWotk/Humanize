import { Outlet } from "react-router-dom";
import Cabecalho from "./components/Cabecalho/Cabecalho";
import Rodape from "./components/Rodape/Rodape";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Cabecalho />
      <div className="pt-16 min-h-screen flex flex-col">
        <Outlet />
      </div>
      <Rodape />
    </div>
  );
}