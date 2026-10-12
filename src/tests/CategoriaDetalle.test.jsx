import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoriaDetalle from '../pages/CategoriaDetalle';
import { obtenerCategorias, obtenerProductosPorCategoria } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerCategorias: vi.fn(),
  obtenerProductosPorCategoria: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/ui/TarjetaProducto', () => ({
  default: ({ producto }) => <article>{producto.nombre}</article>,
}));

describe('CategoriaDetalle', () => {
  it('carga la categoría según el id de la URL y muestra sus productos', async () => {
    obtenerCategorias.mockResolvedValue([
      { id: 1, nombre: 'Teclados' },
      { id: 2, nombre: 'Mouses' },
    ]);
    obtenerProductosPorCategoria.mockResolvedValue([
      { id: 10, nombre: 'Mouse Gamer' },
      { id: 11, nombre: 'Mouse Inalámbrico' },
    ]);

    render(
      <MemoryRouter initialEntries={['/categorias/2']}>
        <Routes>
          <Route path="/categorias/:id" element={<CategoriaDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Mouses', level: 2 })).toBeInTheDocument();
    expect(obtenerCategorias).toHaveBeenCalledTimes(1);

    expect(obtenerProductosPorCategoria).toHaveBeenCalledWith('2');
  
    const tarjetas = await screen.findAllByRole('article');
    expect(tarjetas).toHaveLength(2);
    expect(tarjetas[0]).toHaveTextContent('Mouse Gamer');
    expect(tarjetas[1]).toHaveTextContent('Mouse Inalámbrico');

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Categorías' })).toHaveAttribute('href', '/categorias');
  });
});