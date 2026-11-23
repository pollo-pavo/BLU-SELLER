import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TarjetaProducto from '../../../components/ui/TarjetaProducto';

const { agregar } = vi.hoisted(() => ({ agregar: vi.fn() }));

vi.mock('../../../context/CarritoContext', () => ({
  useCarrito: () => ({ agregar }),
}));

describe('TarjetaProducto', () => {
  it('muestra el producto en oferta con su precio anterior, enlaza a su detalle y lo agrega al carrito', async () => {
    const user = userEvent.setup();
    const producto = {
      id: 5,
      nombre: 'Zapatillas Runner',
      precio: '25000',
      precio_oferta: '19990',
    };

    render(
      <MemoryRouter>
        <TarjetaProducto producto={producto} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Zapatillas Runner' })).toHaveAttribute(
      'href',
      '/productos/5'
    );

    const precioAnterior = screen.getByText('$25000');
    expect(precioAnterior.tagName).toBe('S');
    expect(screen.getByText('$19990')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(agregar).toHaveBeenCalledTimes(1);
    expect(agregar).toHaveBeenCalledWith(producto);
  });

  it('muestra la imagen del producto cuando la tiene y no dibuja <img> cuando no', () => {
    const conImagen = { id: 1, nombre: 'Interstellar', precio: '1000', precio_oferta: null, imagen: '/imagenes/productos/interstellar.jpg' };
    const { container, rerender } = render(
      <MemoryRouter>
        <TarjetaProducto producto={conImagen} />
      </MemoryRouter>
    );
    expect(container.querySelector('img')).toHaveAttribute('src', '/imagenes/productos/interstellar.jpg');

    rerender(
      <MemoryRouter>
        <TarjetaProducto producto={{ ...conImagen, imagen: null }} />
      </MemoryRouter>
    );
    expect(container.querySelector('img')).toBeNull();
  });
});
