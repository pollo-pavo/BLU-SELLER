import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PerfilAdmin from '../../pages/admin/PerfilAdmin';
import { useAuth } from '../../context/AuthContext';
import { adminObtenerUsuario } from '../../services/api';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  adminObtenerUsuario: vi.fn(),
}));

describe('PerfilAdmin', () => {
  it('muestra "Cargando..." y luego los datos del perfil del usuario autenticado', async () => {
    useAuth.mockReturnValue({ usuario: { id: 5 } });
    adminObtenerUsuario.mockResolvedValue({
      id: 5,
      nombre: 'Ana',
      apellidos: 'Pérez',
      run: '12.345.678-9',
      correo: 'ana@correo.com',
      telefono: null,
      fecha_nacimiento: null, 
      direccion: 'Av. Siempre Viva 742',
      region: 'Metropolitana',
      comuna: 'Paine',
      rol: 'admin',
    });

    render(
      <MemoryRouter>
        <PerfilAdmin />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();

    expect(adminObtenerUsuario).toHaveBeenCalledWith(5);

    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByText('ana@correo.com')).toBeInTheDocument();
    expect(screen.getByText('Av. Siempre Viva 742')).toBeInTheDocument();
    expect(screen.getByText('Metropolitana')).toBeInTheDocument();
    expect(screen.getByText('Paine')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();

    expect(screen.getByText('No registrado')).toBeInTheDocument();
    expect(screen.getByText('No registrada')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Editar mis datos' })).toHaveAttribute('href', '/admin/usuarios/5/editar');
  });
});