import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductoNuevo from '../../../pages/admin/productos/ProductoNuevo';
import { adminCrearProducto, obtenerCategorias } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminCrearProducto: vi.fn(),
  obtenerCategorias: vi.fn(),
}));

describe('ProductoNuevo', () => {
  it('muestra el formulario vacío, permite completarlo, crea el producto y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    obtenerCategorias.mockResolvedValue([
      { id: 1, nombre: 'Ropa' },
      { id: 2, nombre: 'Calzado' },
    ]);
    adminCrearProducto.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/productos/nueva']}>
        <Routes>
          <Route path="/admin/productos/nueva" element={<ProductoNuevo />} />
          <Route path="/admin/productos" element={<p>Listado de productos</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'NUEVO PRODUCTO' })).toBeInTheDocument();
    expect(screen.getByLabelText('CÓDIGO')).toHaveValue('');
    expect(screen.getByLabelText('NOMBRE')).toHaveValue('');
    expect(screen.getByLabelText('PRECIO')).toHaveValue(null);

    expect(await screen.findByRole('option', { name: 'Calzado' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ropa' })).toBeInTheDocument();
    expect(obtenerCategorias).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText('CÓDIGO'), 'ZAP-001');
    await user.type(screen.getByLabelText('NOMBRE'), 'Zapatillas Runner');
    await user.type(screen.getByLabelText('DESCRIPCIÓN'), 'Zapatillas livianas');
    await user.type(screen.getByLabelText('PRECIO'), '25000');
    await user.type(screen.getByLabelText('STOCK'), '40');
    await user.type(screen.getByLabelText('STOCK CRÍTICO'), '5');
    await user.selectOptions(screen.getByLabelText('CATEGORÍA'), 'Calzado');
    await user.click(screen.getByRole('button', { name: 'GUARDAR' }));

    expect(adminCrearProducto).toHaveBeenCalledWith({
      codigo: 'ZAP-001',
      nombre: 'Zapatillas Runner',
      descripcion: 'Zapatillas livianas',
      precio: '25000',
      precio_oferta: '',
      stock: '40',
      stock_critico: '5',
      categoria_id: '2',
    });
    expect(alertSpy).toHaveBeenCalledWith('Producto creado correctamente');
    expect(await screen.findByText('Listado de productos')).toBeInTheDocument();
  });
});