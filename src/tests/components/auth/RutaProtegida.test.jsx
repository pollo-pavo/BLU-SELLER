import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RutaProtegida from '../../../components/auth/RutaProtegida';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderizar = (roles) =>
  render(
    <MemoryRouter initialEntries={['/admin/dashboard']}>
      <Routes>
        <Route element={<RutaProtegida roles={roles} />}>
          <Route path="/admin/dashboard" element={<p>Contenido del panel admin</p>} />
        </Route>
        <Route path="/InicioSesion" element={<p>Pantalla de inicio de sesión</p>} />
        <Route path="/admin/ordenes" element={<p>Pantalla de órdenes</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('RutaProtegida', () => {
  it('manda a iniciar sesión a quien no ha entrado', () => {
    useAuth.mockReturnValue({ usuario: null, cargando: false });
    renderizar([ROLES.ADMIN]);

    expect(screen.getByText('Pantalla de inicio de sesión')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
  });

  it('muestra "Cargando..." mientras se valida la sesión, sin redirigir', () => {
    useAuth.mockReturnValue({ usuario: null, cargando: true });
    renderizar([ROLES.ADMIN]);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de inicio de sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
  });

  it('manda al inicio a un cliente que intenta entrar a una ruta de admin', () => {
    useAuth.mockReturnValue({ usuario: { id: 2, rol: ROLES.CLIENTE }, cargando: false });
    renderizar([ROLES.ADMIN, ROLES.VENDEDOR]);

    expect(screen.getByText('Pantalla de inicio')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
  });

  it('manda al vendedor a órdenes cuando la ruta es solo para administrador', () => {
    useAuth.mockReturnValue({ usuario: { id: 3, rol: ROLES.VENDEDOR }, cargando: false });
    renderizar([ROLES.ADMIN]);

    expect(screen.getByText('Pantalla de órdenes')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
  });

  it('deja pasar al vendedor cuando su rol está permitido', () => {
    useAuth.mockReturnValue({ usuario: { id: 3, rol: ROLES.VENDEDOR }, cargando: false });
    renderizar([ROLES.ADMIN, ROLES.VENDEDOR]);

    expect(screen.getByText('Contenido del panel admin')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de órdenes')).not.toBeInTheDocument();
  });

  it('deja pasar al administrador', () => {
    useAuth.mockReturnValue({ usuario: { id: 1, rol: ROLES.ADMIN }, cargando: false });
    renderizar([ROLES.ADMIN]);

    expect(screen.getByText('Contenido del panel admin')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de inicio de sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Pantalla de inicio')).not.toBeInTheDocument();
  });
});