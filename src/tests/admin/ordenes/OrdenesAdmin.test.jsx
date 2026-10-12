import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrdenesAdmin from '../../../pages/admin/ordenes/OrdenesAdmin';
import { adminObtenerOrdenes } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerOrdenes: vi.fn(),
}));

describe('OrdenesAdmin', () => {
  it('muestra cada orden con su fecha, cliente, estado, total y enlace a la boleta', async () => {
    const ordenes = [
      {
        id: 101,
        fecha_creacion: '2026-10-05T15:00:00',
        cliente: 'Ana Pérez',
        estado: 'pagada',
        total: '25000',
      },
      {
        id: 102,
        fecha_creacion: '2026-10-08T15:00:00',
        cliente: 'Luis Soto',
        estado: 'pendiente',
        total: '48500',
      },
    ];
    adminObtenerOrdenes.mockResolvedValue(ordenes);

    render(
      <MemoryRouter>
        <OrdenesAdmin />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: 'Órdenes' })).toBeInTheDocument();
    ['Fecha', 'Orden #', 'Cliente', 'Estado', 'Total', 'Boleta'].forEach((nombre) => {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument();
    });

    await screen.findByText('#101');
    expect(adminObtenerOrdenes).toHaveBeenCalledTimes(1);

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const fila1 = screen.getByText('#101').closest('tr');
    expect(
      within(fila1).getByText(new Date(ordenes[0].fecha_creacion).toLocaleDateString('es-CL'))
    ).toBeInTheDocument();
    expect(within(fila1).getByText('Ana Pérez')).toBeInTheDocument();
    expect(within(fila1).getByText('pagada')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.000')).toBeInTheDocument();
    expect(within(fila1).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute(
      'href',
      '/admin/ordenes/101'
    );

    const fila2 = screen.getByText('#102').closest('tr');
    expect(
      within(fila2).getByText(new Date(ordenes[1].fecha_creacion).toLocaleDateString('es-CL'))
    ).toBeInTheDocument();
    expect(within(fila2).getByText('Luis Soto')).toBeInTheDocument();
    expect(within(fila2).getByText('pendiente')).toBeInTheDocument();
    expect(within(fila2).getByText('$48.500')).toBeInTheDocument();
    expect(within(fila2).getByRole('link', { name: 'Ver boleta' })).toHaveAttribute(
      'href',
      '/admin/ordenes/102'
    );
  });
});