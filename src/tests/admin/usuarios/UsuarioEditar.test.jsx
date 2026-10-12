import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UsuarioEditar from '../../../pages/admin/usuarios/UsuarioEditar';
import { adminObtenerUsuario, adminActualizarUsuario } from '../../../services/api';
import { validarRun } from '../../../utils/validaciones';

vi.mock('../../../services/api', () => ({
  adminObtenerUsuario: vi.fn(),
  adminActualizarUsuario: vi.fn(),
}));

vi.mock('../../../utils/validaciones', () => ({
  validarRun: vi.fn(() => true),
  PATRON_CORREO: '.*',
  TEXTO_CORREO: 'Correo inválido',
}));

vi.mock('../../../data/regiones', () => ({
  regiones: [
    { nombre: 'Metropolitana', comunas: ['Providencia', 'Ñuñoa'] },
    { nombre: 'Valparaíso', comunas: ['Viña del Mar'] },
  ],
}));

describe('UsuarioEditar', () => {
  it('carga el usuario en el formulario, permite editarlo, lo actualiza y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    adminObtenerUsuario.mockResolvedValue({
      id: 21,
      run: '123456785',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      fecha_nacimiento: '1990-05-12',
      telefono: null,
      direccion: 'Av. Siempre Viva 742',
      rol: 'cliente',
      region: 'Metropolitana',
      comuna: 'Providencia',
    });
    adminActualizarUsuario.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/usuarios/21/editar']}>
        <Routes>
          <Route path="/admin/usuarios/:id/editar" element={<UsuarioEditar />} />
          <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    const run = await screen.findByLabelText('RUN');
    expect(adminObtenerUsuario).toHaveBeenCalledWith('21');
    expect(screen.getByText('Editar usuario #21')).toBeInTheDocument();
    expect(run).toHaveValue('123456785');
    const nombre = screen.getByLabelText('NOMBRE');
    expect(nombre).toHaveValue('Ana');
    expect(screen.getByLabelText('APELLIDOS')).toHaveValue('Pérez');
    expect(screen.getByLabelText('CORREO')).toHaveValue('ana@correo.cl');
    expect(screen.getByLabelText('FECHA DE NACIMIENTO (opcional)')).toHaveValue('1990-05-12');
    expect(screen.getByLabelText('TELÉFONO (opcional)')).toHaveValue('');
    expect(screen.getByLabelText('DIRECCIÓN')).toHaveValue('Av. Siempre Viva 742');
    expect(screen.getByLabelText('TIPO DE USUARIO')).toHaveDisplayValue('Cliente');
    expect(screen.getByDisplayValue('Metropolitana')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Providencia')).toBeInTheDocument();

    await user.clear(nombre);
    await user.type(nombre, 'Ana María');
    await user.selectOptions(screen.getByLabelText('TIPO DE USUARIO'), 'Administrador');
    await user.selectOptions(screen.getByDisplayValue('Providencia'), 'Ñuñoa');
    await user.click(screen.getByRole('button', { name: 'ACTUALIZAR' }));
    expect(validarRun).toHaveBeenCalledWith('123456785');
    expect(adminActualizarUsuario).toHaveBeenCalledWith('21', {
      run: '123456785',
      nombre: 'Ana María',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      fecha_nacimiento: '1990-05-12',
      telefono: '',
      direccion: 'Av. Siempre Viva 742',
      rol: 'administrador',
      region: 'Metropolitana',
      comuna: 'Ñuñoa',
    });

    expect(alertSpy).toHaveBeenCalledWith('Usuario actualizado correctamente');
    expect(await screen.findByText('Listado de usuarios')).toBeInTheDocument();
  });
});