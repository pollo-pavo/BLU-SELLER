import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import UsuarioHistorial from '../../../pages/admin/usuarios/UsuarioHistorial';
import { adminObtenerUsuario, adminObtenerHistorial } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerUsuario: vi.fn(),
  adminObtenerHistorial: vi.fn(),
}));

describe('UsuarioHistorial', () => {
  it('carga el usuario y muestra su historial de compras con el enlace a cada boleta', async () => {
    const compras = [
      { id: 101, fecha_creacion: '2026-10-05T15:00:00', estado: 'pagada', total: '25000' },
      { id: 102, fecha_creacion: '2026-10-08T15:00:00', estado: 'pendiente', total: '48500' },
    ];
    adminObtenerUsuario.mockResolvedValue({ id: 21, nombre: 'Ana', apellidos: 'Pérez' });
    adminObtenerHistorial.mockResolvedValue(compras);

    render(
      <MemoryRouter initialEntries={['/admin/usuarios/21/historial']}>
        <Routes>
          <Route path="/admin/usuarios/:id/historial" element={<UsuarioHistorial />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Historial de compras: Ana Pérez' })
    ).toBeInTheDocument();
    expect(adminObtenerUsuario).toHaveBeenCalledWith('21');
    expect(adminObtenerHistorial).toHaveBeenCalledWith('21');


    await screen.findByText('#101');
    ['Orden', 'Fecha', 'Estado', 'Total', 'Boleta'].forEach((nombre) => {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const fila1 = screen.getByText('#101').closest('tr');
    expect(
      within(fila1).getByText(new Date(compras[0].fecha_creacion).toLocaleDateString('es-CL'))
    ).toBeInTheDocument();
    expect(within(fila1).getByText('pagada')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.000')).toBeInTheDocument();
    expect(within(fila1).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute(
      'href',
      '/admin/ordenes/101'
    );

    const fila2 = screen.getByText('#102').closest('tr');
    expect(
      within(fila2).getByText(new Date(compras[1].fecha_creacion).toLocaleDateString('es-CL'))
    ).toBeInTheDocument();
    expect(within(fila2).getByText('pendiente')).toBeInTheDocument();
    expect(within(fila2).getByText('$48.500')).toBeInTheDocument();
    expect(within(fila2).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute(
      'href',
      '/admin/ordenes/102'
    );

    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute(
      'href',
      '/admin/usuarios/21'
    );
  });
});