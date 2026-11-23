import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import UsuariosAdmin from '../../../pages/admin/usuarios/UsuariosAdmin';
import { adminObtenerUsuarios, adminEliminarUsuario } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

vi.mock('../../../services/api', () => ({
  adminObtenerUsuarios: vi.fn(),
  adminEliminarUsuario: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('UsuariosAdmin', () => {
  it('carga y muestra los usuarios con sus enlaces de acciones', async () => {
    useAuth.mockReturnValue({ usuario: { id: 99 } });
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

  it('elimina a otro usuario, pero no ofrece eliminar la propia cuenta', async () => {
    useAuth.mockReturnValue({ usuario: { id: 1 } });
    adminObtenerUsuarios.mockResolvedValue([
      { id: 1, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.com', rol: 'administrador' },
      { id: 2, nombre: 'Luis', apellidos: 'Soto', correo: 'luis@correo.com', rol: 'cliente' },
    ]);
    adminEliminarUsuario.mockResolvedValue({ ok: true });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<MemoryRouter><UsuariosAdmin /></MemoryRouter>);
    await screen.findByText('luis@correo.com');

    expect(screen.getAllByRole('button', { name: 'Eliminar' })).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(adminEliminarUsuario).toHaveBeenCalledWith(2));
    await waitFor(() => expect(screen.queryByText('luis@correo.com')).not.toBeInTheDocument());
  });
});
