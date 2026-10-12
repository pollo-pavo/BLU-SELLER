import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LayoutAdmin.css';

const menuPrincipal = [
  { to: '/admin/dashboard', texto: 'Dashboard' },
  { to: '/admin/ordenes', texto: 'Órdenes' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
    { to: '/admin/perfil', texto: 'Perfil' },
];

function LayoutAdmin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/InicioSesion');
  };

return (
    <div className="layout-admin">
      <aside className="layout-admin-barra">
        <div className="layout-admin-logo">BLUE-SELLER</div>

        <nav className="layout-admin-menu">
          {menuPrincipal.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'layout-admin-link activo' : 'layout-admin-link'
              }
            >
              {item.texto}
            </NavLink>
          ))}
        </nav>

        <div className="layout-admin-inferior">
          <button className="layout-admin-salir" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="layout-admin-contenido">
        <div className="layout-admin-superior">
          <span aria-label="Notificaciones">🔔</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;