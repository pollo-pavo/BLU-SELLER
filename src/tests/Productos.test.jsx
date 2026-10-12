import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../pages/Productos';
import { obtenerProductos } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerProductos: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/ui/TarjetaProducto', () => ({
  default: ({ producto }) => <article>{producto.nombre}</article>,
}));

describe('Productos', () => {
  it('busca con el texto de la URL y muestra los resultados en el título y la lista', async () => {
    obtenerProductos.mockResolvedValue([
      { id: 1, nombre: 'Mouse Gamer' },
      { id: 2, nombre: 'Mouse Inalámbrico' },
    ]);

    render(
      <MemoryRouter initialEntries={['/productos?buscar=mouse']}>
        <Productos />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RESULTADOS PARA "mouse"', level: 2 })).toBeInTheDocument();
    expect(obtenerProductos).toHaveBeenCalledWith('mouse');

    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    const tarjetas = await screen.findAllByRole('article');
    expect(tarjetas).toHaveLength(2);
    expect(tarjetas[0]).toHaveTextContent('Mouse Gamer');
    expect(tarjetas[1]).toHaveTextContent('Mouse Inalámbrico');
    expect(screen.queryByText('No se encontraron productos.')).not.toBeInTheDocument();
    expect(obtenerProductos).toHaveBeenCalledTimes(1);
  });
});