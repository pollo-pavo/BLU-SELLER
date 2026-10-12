import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductoDetalleA from '../../../pages/admin/productos/ProductoDetalleA';
import { adminObtenerProducto } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerProducto: vi.fn(),
}));

const valorDe = (etiqueta) => screen.getByText(etiqueta).nextElementSibling;

describe('ProductoDetalleA', () => {
  it('carga el producto y muestra todos sus datos con los precios formateados y los enlaces', async () => {
    adminObtenerProducto.mockResolvedValue({
      id: 15,
      codigo: 'ZAP-001',
      nombre: 'Zapatillas Runner',
      categoria: 'Calzado',
      precio: '25000',
      precio_oferta: '19990',
      stock: 40,
      stock_critico: 5,
      descripcion: 'Zapatillas livianas para correr',
    });

    render(
      <MemoryRouter initialEntries={['/admin/productos/15']}>
        <Routes>
          <Route path="/admin/productos/:id" element={<ProductoDetalleA />} />
        </Routes>
      </MemoryRouter>
    );

    // Mientras carga se muestra el mensaje de espera
    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Zapatillas Runner' })
    ).toBeInTheDocument();
    expect(adminObtenerProducto).toHaveBeenCalledWith('15');

    expect(valorDe('Código')).toHaveTextContent('ZAP-001');
    expect(valorDe('Categoría')).toHaveTextContent('Calzado');
    expect(valorDe('Precio')).toHaveTextContent('$25.000');
    expect(valorDe('Precio oferta')).toHaveTextContent('$19.990');
    expect(valorDe('Stock')).toHaveTextContent('40');
    expect(valorDe('Stock crítico')).toHaveTextContent('5');
    expect(valorDe('Descripción')).toHaveTextContent('Zapatillas livianas para correr');

    expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/admin/productos/15/editar'
    );
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute(
      'href',
      '/admin/productos'
    );
  });
});