import "./App.css";
import { BrowserRouter, Route ,Routes } from "react-router-dom";

import BarraNavegacion from "./components/layout/navbar";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Blogs from "./pages/Blogs";
import Nosotros from "./pages/Nosotros";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/Registro"
import PanelAdmin from './pages/admin/PanelAdmin';
import RutaAdmin from './components/auth/RutaAdmin';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import { AuthProvider } from "./context/AuthContext";
import LayoutAdmin from './components/layout/LayoutAdmin';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>

          <BarraNavegacion />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/InicioSesion" element={<InicioSesion />} />
            <Route path="/registro" element={<Registro />} />

            <Route element={<RutaAdmin />}>
              <Route element={<LayoutAdmin />}>
                <Route path="/PanelAdmin" element={<PanelAdmin />} />
                <Route path="/ProductosAdmin" element={<ProductosAdmin />} />
                <Route path="/UsuariosAdmin" element={<UsuariosAdmin />} />
              </Route>
            </Route>
    
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </div>
  );
}

export default App;
