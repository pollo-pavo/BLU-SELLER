import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UsuarioDetalle from '../../../pages/admin/usuarios/UsuarioDetalle';
import { adminObtenerUsuario } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerUsuario: vi.fn(),
}));

const valorDe = (etiqueta) => screen.getByText(etiqueta).nextElementSibling;

describe('UsuarioDetalle', () => {
  it('carga el usuario y muestra todos sus datos junto con los enlaces de editar, historial y volver', async () => {
    const fechaCreacion = '2026-10-05T15:00:00';
    adminObtenerUsuario.mockResolvedValue({
      id: 21,
      run: '12.345.678-9',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      telefono: '+56 9 1234 5678',
      fecha_nacimiento: '1990-05-12',
      direccion: 'Av. Siempre Viva 742',
      region: 'Metropolitana',
      comuna: 'Providencia',
      rol: 'cliente',
      fecha_creacion: fechaCreacion,
    });

    render(
      <MemoryRouter initialEntries={['/admin/usuarios/21']}>
        <Routes>
          <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Ana Pérez' })).toBeInTheDocument();
    expect(adminObtenerUsuario).toHaveBeenCalledWith('21');

    expect(valorDe('RUN')).toHaveTextContent('12.345.678-9');
    expect(valorDe('Correo')).toHaveTextContent('ana@correo.cl');
    expect(valorDe('Teléfono')).toHaveTextContent('+56 9 1234 5678');
    expect(valorDe('Fecha de nacimiento')).toHaveTextContent('1990-05-12');
    expect(valorDe('Dirección')).toHaveTextContent('Av. Siempre Viva 742');
    expect(valorDe('Región')).toHaveTextContent('Metropolitana');
    expect(valorDe('Comuna')).toHaveTextContent('Providencia');
    expect(valorDe('Rol')).toHaveTextContent('cliente');
    expect(valorDe('Creado el')).toHaveTextContent(
      new Date(fechaCreacion).toLocaleDateString('es-CL')
    );

    expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/admin/usuarios/21/editar'
    );
    expect(screen.getByRole('link', { name: 'Historial de compras' })).toHaveAttribute(
      'href',
      '/admin/usuarios/21/historial'
    );
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute(
      'href',
      '/admin/usuarios'
    );
  });
});