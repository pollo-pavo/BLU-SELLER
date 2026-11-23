import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LayoutAdmin.css';
import { ROLES } from '../../utils/roles';

const TODOS = [ROLES.ADMIN, ROLES.VENDEDOR];
const SOLO_ADMIN = [ROLES.ADMIN];

const menuPrincipal = [
  { to: '/admin/dashboard', texto: 'Dashboard', roles: SOLO_ADMIN },
  { to: '/admin/ordenes', texto: 'Órdenes', roles: TODOS },
  { to: '/admin/productos', texto: 'Productos', roles: TODOS },
  { to: '/admin/categorias', texto: 'Categorías', roles: SOLO_ADMIN },
  { to: '/admin/usuarios', texto: 'Usuarios', roles: SOLO_ADMIN },
  { to: '/admin/reportes', texto: 'Reportes', roles: SOLO_ADMIN },
  { to: '/admin/perfil', texto: 'Perfil', roles: SOLO_ADMIN },
];

function LayoutAdmin() {
  const { usuario, logout } = useAuth();
  const menu = menuPrincipal.filter((i) => i.roles.includes(usuario?.rol));
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/InicioSesion');
  };

return (
    <div className="layout-admin">
      <aside className="layout-admin-barra">
        <div className="layout-admin-logo">BLU-SELLER</div>

        <nav className="layout-admin-menu">
          {menu.map((item) => (
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
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;