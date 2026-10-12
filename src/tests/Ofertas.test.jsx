import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Ofertas from '../pages/Ofertas';
import { obtenerOfertas } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerOfertas: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/ui/TarjetaProducto', () => ({
  default: ({ producto }) => <article>{producto.nombre}</article>,
}));

describe('Ofertas', () => {
  it('muestra un mensaje mientras no hay ofertas y luego los productos en oferta', async () => {
    obtenerOfertas.mockResolvedValue([
      { id: 1, nombre: 'Mouse Gamer' },
      { id: 2, nombre: 'Teclado Mecánico' },
    ]);

    render(<Ofertas />);

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'OFERTAS', level: 2 })).toBeInTheDocument();

    expect(screen.getByText('No hay productos en oferta por ahora.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    const tarjetas = await screen.findAllByRole('article');
    expect(tarjetas).toHaveLength(2);
    expect(tarjetas[0]).toHaveTextContent('Mouse Gamer');
    expect(tarjetas[1]).toHaveTextContent('Teclado Mecánico');
    expect(screen.queryByText('No hay productos en oferta por ahora.')).not.toBeInTheDocument();
    expect(obtenerOfertas).toHaveBeenCalledTimes(1);
  });
});