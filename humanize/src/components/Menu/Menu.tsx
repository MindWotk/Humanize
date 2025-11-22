import { Link } from "react-router-dom";

export default function Menu(){
  return(
    <nav>
      <Link to="/">Inicio</Link> 
      <Link to="/integrantes">Integrantes</Link>
      <Link to="/faq">Duvidas(FAQ)</Link>
      <Link to="/contato">Fale Conosco</Link>
      <Link to="/sobre">Sobre</Link>
    </nav>
  );
}