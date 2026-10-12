import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosAdmin from '../../../pages/admin/productos/ProductosAdmin';
import { adminObtenerProductos } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerProductos: vi.fn(),
}));

describe('ProductosAdmin', () => {
  it('muestra los enlaces del encabezado y la tabla de productos con sus acciones', async () => {
    adminObtenerProductos.mockResolvedValue([
      { id: 1, codigo: 'MS-001', nombre: 'Mouse Gamer', categoria: 'Mouses', precio: '25990.00', stock: 15 },
      { id: 2, codigo: 'TC-002', nombre: 'Teclado Mecánico', categoria: null, precio: 1250000, stock: 3 },
    ]);

    render(
      <MemoryRouter>
        <ProductosAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Productos', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NUEVO PRODUCTO' })).toHaveAttribute('href', '/admin/productos/nuevo');
    expect(screen.getByRole('link', { name: 'CRÍTICOS' })).toHaveAttribute('href', '/admin/productos/criticos');
    expect(screen.getByRole('link', { name: 'REPORTES' })).toHaveAttribute('href', '/admin/productos/reportes');

    for (const nombre of ['Código', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument();
    }

    await screen.findByText('Mouse Gamer');
    expect(adminObtenerProductos).toHaveBeenCalledTimes(1);

    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(3);
    const [, fila1, fila2] = filas;

    expect(within(fila1).getByText('MS-001')).toBeInTheDocument();
    expect(within(fila1).getByText('Mouses')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.990')).toBeInTheDocument();
    expect(within(fila1).getByText('15')).toBeInTheDocument();
    expect(within(fila1).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/productos/1');
    expect(within(fila1).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/productos/1/editar');

    expect(within(fila2).getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(within(fila2).getByText('-')).toBeInTheDocument();
    expect(within(fila2).getByText('$1.250.000')).toBeInTheDocument();
    expect(within(fila2).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/productos/2');
    expect(within(fila2).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/productos/2/editar');
  });
});