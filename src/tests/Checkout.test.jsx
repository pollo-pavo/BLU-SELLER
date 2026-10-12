import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { crearOrden } from '../services/api';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../services/api', () => ({
  crearOrden: vi.fn(),
}));

vi.mock('../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../data/regiones', () => ({
  regiones: [
    { nombre: 'Metropolitana', comunas: ['Paine', 'Santiago'] },
    { nombre: 'Valparaíso', comunas: ['Viña del Mar'] },
  ],
}));

describe('Checkout', () => {
  it('muestra el resumen, precarga los datos del usuario y crea la orden al pagar', async () => {
    const user = userEvent.setup();
    const vaciar = vi.fn();

    useCarrito.mockReturnValue({
      items: [
        { id: 1, nombre: 'Mouse Gamer', precio: 25990, cantidad: 2 },
        { id: 2, nombre: 'Teclado Mecánico', precio: 40000, cantidad: 3 },
      ],
      totalPrecio: 171980,
      vaciar,
    });
    useAuth.mockReturnValue({
      usuario: {
        id: 5,
        nombre: 'Ana',
        apellidos: 'Pérez',
        correo: 'ana@duoc.cl',
        direccion: 'Av. Siempre Viva 742',
        region: 'Metropolitana',
        comuna: 'Paine',
      },
    });
    crearOrden.mockResolvedValue({ id: 99 });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Carrito de compra' })).toBeInTheDocument();
    expect(screen.getByText('Total a pagar: $171.980')).toBeInTheDocument();

    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(3);
    expect(within(filas[1]).getByText('Mouse Gamer')).toBeInTheDocument();
    expect(within(filas[1]).getByText('$25.990')).toBeInTheDocument();
    expect(within(filas[1]).getByText('$51.980')).toBeInTheDocument();
    expect(within(filas[2]).getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(within(filas[2]).getByText('$40.000')).toBeInTheDocument();
    expect(within(filas[2]).getByText('$120.000')).toBeInTheDocument();

    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('Ana');
    expect(screen.getByLabelText(/^Apellidos/)).toHaveValue('Pérez');
    expect(screen.getByLabelText(/^Correo/)).toHaveValue('ana@duoc.cl');
    expect(screen.getByLabelText(/^Calle/)).toHaveValue('Av. Siempre Viva 742');
    expect(screen.getByLabelText(/^Región/)).toHaveValue('Metropolitana');
    expect(screen.getByLabelText(/^Comuna/)).toHaveValue('Paine');

    const nombre = screen.getByLabelText(/^Nombre/);
    await user.clear(nombre);
    await user.type(nombre, 'Luis');
    await user.type(screen.getByLabelText(/^Departamento/), '603');
    await user.type(screen.getByLabelText(/^Indicaciones/), 'Tocar el timbre');
    await user.selectOptions(screen.getByLabelText(/^Región/), 'Valparaíso');
    await user.selectOptions(screen.getByLabelText(/^Comuna/), 'Viña del Mar');

    await user.click(screen.getByRole('button', { name: 'Pagar ahora $171.980' }));

    await waitFor(() => expect(crearOrden).toHaveBeenCalledTimes(1));
    expect(crearOrden).toHaveBeenCalledWith({
      usuario_id: 5,
      nombre: 'Luis',
      apellidos: 'Pérez',
      correo: 'ana@duoc.cl',
      calle: 'Av. Siempre Viva 742',
      departamento: '603',
      region: 'Valparaíso',
      comuna: 'Viña del Mar',
      indicaciones: 'Tocar el timbre',
      items: [
        { id: 1, cantidad: 2 },
        { id: 2, cantidad: 3 },
      ],
    });

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/pago-correcto?orden=99'));
    expect(vaciar).toHaveBeenCalledTimes(1);
  });
});