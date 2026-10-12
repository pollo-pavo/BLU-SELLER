import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductoDetalle from '../pages/ProductoDetalle';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProducto, obtenerProductos } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerProducto: vi.fn(),
  obtenerProductos: vi.fn(),
}));

vi.mock('../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('ProductoDetalle', () => {
  it('muestra el producto según el id de la URL, sus relacionados y lo añade al carrito', async () => {
    const user = userEvent.setup();
    const agregar = vi.fn();
    useCarrito.mockReturnValue({ agregar });

    const producto = {
      id: 3,
      nombre: 'Mouse Gamer',
      categoria: 'Mouses',
      categoria_id: 2,
      precio: '25990.00',
      precio_oferta: '19990.00',
      descripcion: 'Mouse con sensor óptico de alta precisión.',
    };
    obtenerProducto.mockResolvedValue(producto);
    obtenerProductos.mockResolvedValue([
      { id: 3, nombre: 'Mouse Gamer' },
      { id: 4, nombre: 'Teclado Mecánico' },
      { id: 5, nombre: 'Audífonos Pro' },
      { id: 6, nombre: 'Monitor 24' },
      { id: 7, nombre: 'Webcam HD' },
      { id: 8, nombre: 'Parlante BT' },
      { id: 9, nombre: 'Silla Gamer' },
    ]);

    render(
      <MemoryRouter initialEntries={['/productos/3']}>
        <Routes>
          <Route path="/productos/:id" element={<ProductoDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Mouse Gamer', level: 2 })).toBeInTheDocument();
    expect(obtenerProducto).toHaveBeenCalledWith('3');
    expect(screen.getByText('Mouse con sensor óptico de alta precisión.')).toBeInTheDocument();

    expect(screen.getByText('$25990')).toBeInTheDocument();
    expect(screen.getByText('$19990')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Mouses' })).toHaveAttribute('href', '/categorias/2');

    expect(screen.getByRole('heading', { name: 'Productos relacionados', level: 5 })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Teclado Mecánico' })).toHaveAttribute('href', '/productos/4');
    expect(screen.getByRole('link', { name: 'Audífonos Pro' })).toHaveAttribute('href', '/productos/5');
    expect(screen.getByRole('link', { name: 'Monitor 24' })).toHaveAttribute('href', '/productos/6');
    expect(screen.getByRole('link', { name: 'Webcam HD' })).toHaveAttribute('href', '/productos/7');
    expect(screen.getByRole('link', { name: 'Parlante BT' })).toHaveAttribute('href', '/productos/8');
    expect(screen.queryByRole('link', { name: 'Mouse Gamer' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Silla Gamer' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Cantidad'), '3');
    await user.click(screen.getByRole('button', { name: 'Añadir al carrito' }));

    expect(agregar).toHaveBeenCalledTimes(1);
    expect(agregar).toHaveBeenCalledWith(producto, 3);
  });
});