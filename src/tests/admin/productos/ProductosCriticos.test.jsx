import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosCriticos from '../../../pages/admin/productos/ProductosCriticos';
import { adminObtenerCriticos } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerCriticos: vi.fn(),
}));

describe('ProductosCriticos', () => {
  it('lista los productos con stock crítico, distingue los agotados y enlaza a su edición para reponer', async () => {
    adminObtenerCriticos.mockResolvedValue([
      { id: 1, codigo: 'ZAP-001', nombre: 'Zapatillas Runner', stock: 0, stock_critico: 5 },
      { id: 2, codigo: 'MOC-010', nombre: 'Mochila Urbana', stock: 3, stock_critico: 10 },
    ]);

    render(
      <MemoryRouter>
        <ProductosCriticos />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Productos críticos' })).toBeInTheDocument();
    ['Código', 'Nombre', 'Stock', 'Crítico', 'Acciones'].forEach((nombre) => {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument();
    });

    await screen.findByText('ZAP-001');
    expect(adminObtenerCriticos).toHaveBeenCalledTimes(1);

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const filaAgotado = screen.getByText('ZAP-001').closest('tr');
    expect(within(filaAgotado).getByText('Zapatillas Runner')).toBeInTheDocument();
    expect(within(filaAgotado).getByRole('cell', { name: '0' })).toHaveClass('agotado');
    expect(within(filaAgotado).getByText('5')).toBeInTheDocument();
    expect(within(filaAgotado).getByRole('link', { name: 'Reponer' })).toHaveAttribute(
      'href',
      '/admin/productos/1/editar'
    );

    const filaBajo = screen.getByText('MOC-010').closest('tr');
    expect(within(filaBajo).getByText('Mochila Urbana')).toBeInTheDocument();
    expect(within(filaBajo).getByRole('cell', { name: '3' })).toHaveClass('bajo');
    expect(within(filaBajo).getByText('10')).toBeInTheDocument();
    expect(within(filaBajo).getByRole('link', { name: 'Reponer' })).toHaveAttribute(
      'href',
      '/admin/productos/2/editar'
    );
  });
});