import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Categorias from '../pages/Categorias';
import { obtenerCategorias, obtenerProductos } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerCategorias: vi.fn(),
  obtenerProductos: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/ui/TarjetaProducto', () => ({
  default: ({ producto }) => <article>{producto.nombre}</article>,
}));

describe('Categorias', () => {
  it('muestra las categorías con su enlace y agrupa los productos por categoría', async () => {
    obtenerCategorias.mockResolvedValue([
      { id: 1, nombre: 'Teclados' },
      { id: 2, nombre: 'Mouses' },
    ]);
    obtenerProductos.mockResolvedValue([
      { id: 10, nombre: 'Teclado Mecánico', categoria_id: 1 },
      { id: 11, nombre: 'Mouse Gamer', categoria_id: 2 },
      { id: 12, nombre: 'Mouse Inalámbrico', categoria_id: 2 },
      { id: 13, nombre: 'Producto huérfano', categoria_id: 99 },
    ]);

    render(
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CATEGORÍAS', level: 2 })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();

    expect(await screen.findByRole('link', { name: 'Teclados' })).toHaveAttribute('href', '/categorias/1');
    expect(screen.getByRole('link', { name: 'Mouses' })).toHaveAttribute('href', '/categorias/2');

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3));
    expect(obtenerCategorias).toHaveBeenCalledTimes(1);
    expect(obtenerProductos).toHaveBeenCalledTimes(1);

    const titulos = screen.getAllByRole('heading', { level: 3 });
    expect(titulos).toHaveLength(2);
    expect(titulos[0]).toHaveTextContent('Teclados');
    expect(titulos[1]).toHaveTextContent('Mouses');

    const seccionTeclados = within(titulos[0].parentElement);
    expect(seccionTeclados.getAllByRole('article')).toHaveLength(1);
    expect(seccionTeclados.getByText('Teclado Mecánico')).toBeInTheDocument();

    const seccionMouses = within(titulos[1].parentElement);
    expect(seccionMouses.getAllByRole('article')).toHaveLength(2);
    expect(seccionMouses.getByText('Mouse Gamer')).toBeInTheDocument();
    expect(seccionMouses.getByText('Mouse Inalámbrico')).toBeInTheDocument();

    expect(screen.queryByText('Producto huérfano')).not.toBeInTheDocument();
  });
});