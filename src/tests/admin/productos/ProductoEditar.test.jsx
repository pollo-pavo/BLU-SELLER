import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductoEditar from '../../../pages/admin/productos/ProductoEditar';
import {
  adminObtenerProducto,
  adminActualizarProducto,
  obtenerCategorias,
} from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerProducto: vi.fn(),
  adminActualizarProducto: vi.fn(),
  obtenerCategorias: vi.fn(),
}));

describe('ProductoEditar', () => {
  it('carga el producto en el formulario, permite editarlo, lo actualiza y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    adminObtenerProducto.mockResolvedValue({
      id: 15,
      codigo: 'ZAP-001',
      nombre: 'Zapatillas Runner',
      descripcion: 'Zapatillas livianas',
      precio: '25000',
      precio_oferta: null,
      stock: 40,
      stock_critico: 5,
      categoria_id: 2,
    });
    obtenerCategorias.mockResolvedValue([
      { id: 1, nombre: 'Ropa' },
      { id: 2, nombre: 'Calzado' },
    ]);
    adminActualizarProducto.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/productos/15/editar']}>
        <Routes>
          <Route path="/admin/productos/:id/editar" element={<ProductoEditar />} />
          <Route path="/admin/productos" element={<p>Listado de productos</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    const nombre = await screen.findByLabelText('NOMBRE');
    expect(adminObtenerProducto).toHaveBeenCalledWith('15');
    expect(screen.getByText('Editar producto ZAP-001')).toBeInTheDocument();
    expect(screen.getByLabelText('CÓDIGO')).toHaveValue('ZAP-001');
    expect(nombre).toHaveValue('Zapatillas Runner');
    expect(screen.getByLabelText('DESCRIPCIÓN')).toHaveValue('Zapatillas livianas');
    expect(screen.getByLabelText('PRECIO')).toHaveValue(25000);
    expect(screen.getByLabelText('PRECIO OFERTA (OPCIONAL)')).toHaveValue(null);
    expect(screen.getByLabelText('STOCK')).toHaveValue(40);
    expect(screen.getByLabelText('STOCK CRÍTICO')).toHaveValue(5);
    expect(screen.getByLabelText('CATEGORÍA')).toHaveDisplayValue('Calzado');

    await user.clear(nombre);
    await user.type(nombre, 'Zapatillas Pro');
    const precio = screen.getByLabelText('PRECIO');
    await user.clear(precio);
    await user.type(precio, '27000');
    await user.type(screen.getByLabelText('PRECIO OFERTA (OPCIONAL)'), '19990');
    await user.click(screen.getByRole('button', { name: 'ACTUALIZAR' }));

    expect(adminActualizarProducto).toHaveBeenCalledWith('15', {
      codigo: 'ZAP-001',
      nombre: 'Zapatillas Pro',
      descripcion: 'Zapatillas livianas',
      precio: '27000',
      precio_oferta: '19990',
      stock: '40',
      stock_critico: '5',
      categoria_id: '2',
    });
    expect(alertSpy).toHaveBeenCalledWith('Producto actualizado correctamente');
    expect(await screen.findByText('Listado de productos')).toBeInTheDocument();
  });
});