import "./App.css";
import { BrowserRouter, Route ,Routes } from "react-router-dom";

import BarraNavegacion from "./components/layout/navbar";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Blogs from "./pages/Blogs";
import Nosotros from "./pages/Nosotros";
import InicioSesion from "./pages/InicioSesion";

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <BarraNavegacion />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/InicioSesion" element={<InicioSesion />} />
  
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
