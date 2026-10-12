import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../pages/Carrito';
import { useCarrito } from '../context/CarritoContext';
import { obtenerProductos } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerProductos: vi.fn(),
}));

vi.mock('../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/ui/TarjetaProducto', () => ({
  default: ({ producto }) => <article>{producto.nombre}</article>,
}));

describe('Carrito', () => {
  it('muestra los productos disponibles y el carrito, y ejecuta sus acciones', async () => {
    const user = userEvent.setup();

    const cambiarCantidad = vi.fn();
    const quitar = vi.fn();
    const vaciar = vi.fn();

    useCarrito.mockReturnValue({
      items: [
        { id: 1, nombre: 'Mouse Gamer', precio: 25990, cantidad: 2 },
        { id: 2, nombre: 'Teclado Mecánico', precio: 40000, cantidad: 3 },
      ],
      cambiarCantidad,
      quitar,
      vaciar,
      totalPrecio: 171980,
    });

    obtenerProductos.mockResolvedValue([
      { id: 10, nombre: 'Audífonos Pro' },
      { id: 11, nombre: 'Monitor 24' },
    ]);

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Lista de productos' })).toBeInTheDocument();
    const tarjetas = await screen.findAllByRole('article');
    expect(tarjetas).toHaveLength(2);
    expect(tarjetas[0]).toHaveTextContent('Audífonos Pro');
    expect(tarjetas[1]).toHaveTextContent('Monitor 24');
    expect(obtenerProductos).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('heading', { name: 'Carrito de Compras' })).toBeInTheDocument();
    expect(screen.queryByText('El carrito está vacío.')).not.toBeInTheDocument();
    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(3);
    const [, fila1, fila2] = filas;

    expect(within(fila1).getByText('Mouse Gamer')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.990')).toBeInTheDocument();
    expect(within(fila1).getAllByRole('cell')[3]).toHaveTextContent('2');
    expect(within(fila1).getByText('$51.980')).toBeInTheDocument();

    expect(within(fila2).getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(within(fila2).getByText('$40.000')).toBeInTheDocument();
    expect(within(fila2).getAllByRole('cell')[3]).toHaveTextContent('3');
    expect(within(fila2).getByText('$120.000')).toBeInTheDocument();

    expect(screen.getByText('Total: $171.980')).toBeInTheDocument();

    await user.click(within(fila1).getByRole('button', { name: '+' }));
    expect(cambiarCantidad).toHaveBeenLastCalledWith(1, 3);

    await user.click(within(fila1).getByRole('button', { name: '-' }));
    expect(cambiarCantidad).toHaveBeenLastCalledWith(1, 1);

    await user.click(within(fila1).getByRole('button', { name: 'Eliminar' }));
    expect(quitar).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(vaciar).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('button', { name: 'Comprar ahora' })).toHaveAttribute('href', '/checkout');
  });
});