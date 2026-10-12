import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsuariosAdmin from '../../../pages/admin/usuarios/UsuariosAdmin';
import { adminObtenerUsuarios } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerUsuarios: vi.fn(),
}));

describe('UsuariosAdmin', () => {
  it('carga y muestra los usuarios con sus enlaces de acciones', async () => {
    adminObtenerUsuarios.mockResolvedValue([
      { id: 1, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.com', rol: 'admin' },
      { id: 2, nombre: 'Luis', apellidos: 'Soto', correo: 'luis@correo.com', rol: 'cliente' },
    ]);

    render(
      <MemoryRouter>
        <UsuariosAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NUEVO USUARIO' })).toHaveAttribute('href', '/admin/usuarios/nuevo');

    await screen.findByText('ana@correo.com');
    expect(adminObtenerUsuarios).toHaveBeenCalledTimes(1);

    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(3);

    const fila = filas[1];
    expect(within(fila).getByText('Ana Pérez')).toBeInTheDocument();
    expect(within(fila).getByText('admin')).toBeInTheDocument();

    expect(within(fila).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/usuarios/1');
    expect(within(fila).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/usuarios/1/editar');
    expect(within(fila).getByRole('link', { name: 'Historial' })).toHaveAttribute('href', '/admin/usuarios/1/historial');
  });
});