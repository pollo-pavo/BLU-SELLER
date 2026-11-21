import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LayoutAdmin', () => {
  it('muestra el menú con la sección activa, el contenido de la ruta y cierra la sesión', async () => {
    const user = userEvent.setup();
    const logout = vi.fn();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN }, logout });

    render(
      <MemoryRouter initialEntries={['/admin/productos']}>
        <Routes>
          <Route element={<LayoutAdmin />}>
            <Route path="/admin/dashboard" element={<p>Contenido del dashboard</p>} />
            <Route path="/admin/productos" element={<p>Contenido de productos</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('BLUE-SELLER')).toBeInTheDocument();
    expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument();

    const menu = [
      ['Dashboard', '/admin/dashboard'],
      ['Órdenes', '/admin/ordenes'],
      ['Productos', '/admin/productos'],
      ['Categorías', '/admin/categorias'],
      ['Usuarios', '/admin/usuarios'],
      ['Reportes', '/admin/reportes'],
      ['Perfil', '/admin/perfil'],
    ];
    for (const [texto, ruta] of menu) {
      expect(screen.getByRole('link', { name: texto })).toHaveAttribute('href', ruta);
    }

    expect(screen.getByText('Contenido de productos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveClass('activo');
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveClass('activo');

    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(screen.getByText('Contenido del dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Contenido de productos')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('activo');
    expect(screen.getByRole('link', { name: 'Productos' })).not.toHaveClass('activo');

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/InicioSesion');
  });

  it('al vendedor solo le muestra Órdenes y Productos', () => {
    useAuth.mockReturnValue({ usuario: { rol: ROLES.VENDEDOR }, logout: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/admin/ordenes']}>
        <Routes>
          <Route element={<LayoutAdmin />}>
            <Route path="/admin/ordenes" element={<p>Contenido de órdenes</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Órdenes' })).toHaveAttribute('href', '/admin/ordenes');
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', '/admin/productos');

    for (const texto of ['Dashboard', 'Categorías', 'Usuarios', 'Reportes', 'Perfil']) {
      expect(screen.queryByRole('link', { name: texto })).not.toBeInTheDocument();
    }
  });
});