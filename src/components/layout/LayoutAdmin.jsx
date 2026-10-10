import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/LayoutAdmin.css';

const menuPrincipal = [
  { to: '/admin/dashboard', texto: 'Dashboard' },
  { to: '/admin/ordenes', texto: 'Órdenes' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
];

function LayoutAdmin() {
  return (
    <div className="layout-admin">
      <aside className="layout-admin-barra">
        <div className="layout-admin-logo">Company</div>

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

        <nav className="layout-admin-menu layout-admin-inferior">
          <span className="layout-admin-link">Configuración</span>
          <span className="layout-admin-link">Ayuda</span>
          <div className="layout-admin-perfil">Perfil</div>
        </nav>
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