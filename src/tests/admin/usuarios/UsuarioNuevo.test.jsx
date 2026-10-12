import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UsuarioNuevo from '../../../pages/admin/usuarios/UsuarioNuevo';
import { adminCrearUsuario } from '../../../services/api';
import { validarRun } from '../../../utils/validaciones';

vi.mock('../../../services/api', () => ({
  adminCrearUsuario: vi.fn(),
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

describe('UsuarioNuevo', () => {
  it('muestra el formulario vacío, permite completarlo, crea el usuario y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    adminCrearUsuario.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/usuarios/nuevo']}>
        <Routes>
          <Route path="/admin/usuarios/nuevo" element={<UsuarioNuevo />} />
          <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'NUEVO USUARIO' })).toBeInTheDocument();
    expect(screen.getByLabelText('RUN')).toHaveValue('');
    expect(screen.getByLabelText('NOMBRE')).toHaveValue('');
    expect(screen.getByLabelText('TIPO DE USUARIO')).toHaveDisplayValue('Cliente');

    await user.type(screen.getByLabelText('RUN'), '123456785');
    await user.type(screen.getByLabelText('NOMBRE'), 'Ana');
    await user.type(screen.getByLabelText('APELLIDOS'), 'Pérez');
    await user.type(screen.getByLabelText('CORREO'), 'ana@correo.cl');
    await user.type(screen.getByLabelText('CONFIRMAR CORREO'), 'ana@correo.cl');
    await user.type(screen.getByLabelText('CONTRASEÑA'), 'clave123');
    await user.type(screen.getByLabelText('CONFIRMAR CONTRASEÑA'), 'clave123');
    await user.type(screen.getByLabelText('TELÉFONO (opcional)'), '+56912345678');
    await user.type(screen.getByLabelText('DIRECCIÓN'), 'Av. Siempre Viva 742');
    await user.selectOptions(screen.getByLabelText('TIPO DE USUARIO'), 'Vendedor');
    await user.selectOptions(
      screen.getByDisplayValue('-- Seleccione la región --'),
      'Metropolitana'
    );
    await user.selectOptions(screen.getByDisplayValue('-- Seleccione la comuna --'), 'Ñuñoa');
    await user.click(screen.getByRole('button', { name: 'REGISTRAR' }));

    expect(validarRun).toHaveBeenCalledWith('123456785');
    expect(adminCrearUsuario).toHaveBeenCalledWith({
      run: '123456785',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      contrasena: 'clave123',
      fecha_nacimiento: '',
      telefono: '+56912345678',
      direccion: 'Av. Siempre Viva 742',
      rol: 'vendedor',
      region: 'Metropolitana',
      comuna: 'Ñuñoa',
    });

    expect(alertSpy).toHaveBeenCalledWith('Usuario creado correctamente');
    expect(await screen.findByText('Listado de usuarios')).toBeInTheDocument();
  });
});