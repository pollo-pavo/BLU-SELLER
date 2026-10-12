import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RutaAdmin from '../../../components/auth/RutaAdmin';
import { useAuth } from '../../../context/AuthContext';

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderizar = () =>
  render(
    <MemoryRouter initialEntries={['/admin/dashboard']}>
      <Routes>
        <Route element={<RutaAdmin />}>
          <Route path="/admin/dashboard" element={<p>Contenido del panel admin</p>} />
        </Route>
        <Route path="/InicioSesion" element={<p>Pantalla de inicio de sesión</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('RutaAdmin', () => {
  it('redirige a quien no es admin y deja pasar solo a los administradores', () => {

    useAuth.mockReturnValue({ usuario: null });
    const primera = renderizar();
    expect(screen.getByText('Pantalla de inicio de sesión')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
    primera.unmount();

    useAuth.mockReturnValue({ usuario: { id: 2, rol: 'cliente' } });
    const segunda = renderizar();
    expect(screen.getByText('Pantalla de inicio')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel admin')).not.toBeInTheDocument();
    segunda.unmount();

    useAuth.mockReturnValue({ usuario: { id: 1, rol: 'admin' } });
    renderizar();
    expect(screen.getByText('Contenido del panel admin')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de inicio de sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Pantalla de inicio')).not.toBeInTheDocument();
  });
});