import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Home from './pages/Home';
import InicioSesion from './pages/InicioSesion';
import Registro from './pages/Registro';
import Blogs from './pages/Blogs';
import Productos from './pages/Productos';

export default function App() {
  return (
    <Router>
      {/* El Navbar se mantiene fijo en todas las vistas */}
      <Navbar /> 
      {/* Aquí cambia el contenido según la URL actual */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/signup" element={<InicioSesion />} />
        <Route path="/signin" element={<Registro />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </Router>
  );
}
