import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import { useAuth } from '../../../context/AuthContext';

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
    useAuth.mockReturnValue({ logout });

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

    expect(screen.getByText('Company')).toBeInTheDocument();
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
});