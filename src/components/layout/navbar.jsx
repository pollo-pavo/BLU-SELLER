import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav >
      <Link to="/" >Home </Link>
      <Link to="/nosotros" >Nosotros </Link>
      <Link to="/contacto" >Contacto </Link>
      <Link to="/signup" >InicioSesion </Link>
      <Link to="/signin" >Registro </Link>
      <Link to="/blogs" >Blogs </Link>
      <Link to="/productos" >Productos </Link>
    </nav>
  );
}
