import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MisPedidos from '../pages/MisPedidos';
import { obtenerMisOrdenes } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerMisOrdenes: vi.fn(),
}));

describe('MisPedidos', () => {
  it('lista las compras del usuario con sus productos y total', async () => {
    obtenerMisOrdenes.mockResolvedValue([
      {
        id: 7,
        fecha_creacion: '2026-11-20T15:00:00',
        estado: 'pagada',
        total: 51980,
        items: [{ producto_id: 1, nombre: 'Mouse Gamer', precio_unitario: 25990, cantidad: 2 }],
      },
    ]);

    render(<MemoryRouter><MisPedidos /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Mis pedidos' })).toBeInTheDocument();
    expect(await screen.findByText('#7')).toBeInTheDocument();
    expect(screen.getByText('2 × Mouse Gamer')).toBeInTheDocument();
    expect(screen.getByText('pagada')).toBeInTheDocument();
    expect(screen.getByText('$51.980')).toBeInTheDocument();
  });

  it('avisa cuando todavía no hay compras', async () => {
    obtenerMisOrdenes.mockResolvedValue([]);

    render(<MemoryRouter><MisPedidos /></MemoryRouter>);

    expect(await screen.findByText(/Aún no tienes compras/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/productos');
  });

  it('muestra el mensaje de error si falla la carga', async () => {
    obtenerMisOrdenes.mockRejectedValue(new Error('Tu sesión expiró'));

    render(<MemoryRouter><MisPedidos /></MemoryRouter>);

    expect(await screen.findByRole('alert')).toHaveTextContent('Tu sesión expiró');
  });
});
