import "./App.css";
import { BrowserRouter, Route ,Routes } from "react-router-dom";

import LayoutPublico from "./components/layout/LayoutPublico";
import LayoutAdmin from './components/layout/LayoutAdmin';
import RutaAdmin from './components/auth/RutaAdmin';
import { AuthProvider } from "./context/AuthContext";

import { CarritoProvider } from "./context/CarritoContext";


import Home from "./pages/Home";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Contacto from "./pages/Contacto";
import Blogs from "./pages/Blogs";
import BlogDetalle from "./pages/BlogDetalle";
import Nosotros from "./pages/Nosotros";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/Registro"

import Checkout from "./pages/Checkout";
import PagoCorrecto from "./pages/PagoCorrecto";
import PagoError from "./pages/PagoError";

import PanelAdmin from "./pages/admin/PanelAdmin";
import ReportesAdmin from "./pages/admin/ReportesAdmin";

import OrdenesAdmin from "./pages/admin/ordenes/OrdenesAdmin";
import BoletaAdmin from "./pages/admin/ordenes/BoletaAdmin";

import ProductosAdmin from "./pages/admin/productos/ProductosAdmin";
import ProductoNuevo from "./pages/admin/productos/ProductoNuevo";
import ProductoDetalleA from "./pages/admin/productos/ProductoDetalleA";
import ProductoEditar from "./pages/admin/productos/ProductoEditar";
import ProductosCriticos from "./pages/admin/productos/ProductosCriticos";
import ProductosReportes from "./pages/admin/productos/ProductosReportes";

import CategoriasAdmin from "./pages/admin/categorias/CategoriaAdmin";
import CategoriaNueva from "./pages/admin/categorias/CategoriaNueva";
import CategoriaEditar from "./pages/admin/categorias/CategoriaEditar";

import UsuariosAdmin from "./pages/admin/usuarios/UsuariosAdmin";
import UsuarioNuevo from "./pages/admin/usuarios/UsuarioNuevo";
import UsuarioDetalle from "./pages/admin/usuarios/UsuarioDetalle";
import UsuarioEditar from "./pages/admin/usuarios/UsuarioEditar";
import UsuarioHistorial from "./pages/admin/usuarios/UsuarioHistorial";
import Categorias from "./pages/Categorias";
import CategoriaDetalle from "./pages/CategoriaDetalle";
import Ofertas from "./pages/Ofertas";
import Carrito from "./pages/Carrito";


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CarritoProvider>
        <BrowserRouter>
        
          <Routes>
            <Route element={<LayoutPublico />}>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetalle />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categorias/:id" element={<CategoriaDetalle />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/InicioSesion" element={<InicioSesion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pago-correcto" element={<PagoCorrecto />} />
              <Route path="/pago-error" element={<PagoError />} />
            </Route>

            <Route element={<RutaAdmin />}>
              <Route element={<LayoutAdmin />}>
                <Route path="/admin/dashboard" element={<PanelAdmin />} />
                <Route path="/admin/reportes" element={<ReportesAdmin />} />

                <Route path="/admin/ordenes" element={<OrdenesAdmin />} />
                <Route path="/admin/ordenes/:id" element={<BoletaAdmin />} />

                <Route path="/admin/productos" element={<ProductosAdmin />} />
                <Route path="/admin/productos/nuevo" element={<ProductoNuevo />} />
                <Route path="/admin/productos/criticos" element={<ProductosCriticos />} />
                <Route path="/admin/productos/reportes" element={<ProductosReportes />} />
                <Route path="/admin/productos/:id" element={<ProductoDetalleA />} />
                <Route path="/admin/productos/:id/editar" element={<ProductoEditar />} />

                <Route path="/admin/categorias" element={<CategoriasAdmin />} />
                <Route path="/admin/categorias/nueva" element={<CategoriaNueva />} />
                <Route path="/admin/categorias/:id/editar" element={<CategoriaEditar />} />

                <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
                <Route path="/admin/usuarios/nuevo" element={<UsuarioNuevo />} />
                <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
                <Route path="/admin/usuarios/:id/editar" element={<UsuarioEditar />} />
                <Route path="/admin/usuarios/:id/historial" element={<UsuarioHistorial />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
        </CarritoProvider>
      </AuthProvider>

    </div>
  );
}

export default App;
