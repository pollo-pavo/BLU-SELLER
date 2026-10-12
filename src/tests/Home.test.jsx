import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { obtenerProductos, obtenerCategorias } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerProductos: vi.fn(),
  obtenerCategorias: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('Home', () => {
  it('muestra el carrusel, las categorías y solo los 4 primeros productos destacados', async () => {
    obtenerCategorias.mockResolvedValue([
      { id: 1, nombre: 'Teclados' },
      { id: 2, nombre: 'Mouses' },
    ]);
    obtenerProductos.mockResolvedValue([
      { id: 10, nombre: 'Mouse Gamer', precio: 25990 },
      { id: 11, nombre: 'Teclado Mecánico', precio: 40000 },
      { id: 12, nombre: 'Audífonos Pro', precio: 59990 },
      { id: 13, nombre: 'Monitor 24', precio: 129990 },
      { id: 14, nombre: 'Webcam HD', precio: 19990 },
    ]);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nuevos Lanzamientos', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ofertas de la semana', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Los más vendidos', level: 3 })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Categorías', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Productos destacados', level: 2 })).toBeInTheDocument();

    expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();

    expect(await screen.findByRole('link', { name: /Teclados/ })).toHaveAttribute('href', '/categorias/1');
    expect(screen.getByRole('link', { name: /Mouses/ })).toHaveAttribute('href', '/categorias/2');
    expect(obtenerCategorias).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('Mouse Gamer')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(screen.getByText('Audífonos Pro')).toBeInTheDocument();
    expect(screen.getByText('Monitor 24')).toBeInTheDocument();
    expect(screen.queryByText('Webcam HD')).not.toBeInTheDocument();
    expect(obtenerProductos).toHaveBeenCalledTimes(1);

    expect(screen.getByText('$25.990')).toBeInTheDocument();
    expect(screen.getByText('$40.000')).toBeInTheDocument();
    expect(screen.getByText('$59.990')).toBeInTheDocument();
    expect(screen.getByText('$129.990')).toBeInTheDocument();

    const detalles = screen.getAllByRole('link', { name: 'Ver detalle' });
    expect(detalles).toHaveLength(4);
    expect(detalles[0]).toHaveAttribute('href', '/productos/10');
    expect(detalles[3]).toHaveAttribute('href', '/productos/13');

    expect(screen.getByRole('link', { name: 'Ver todos los productos' })).toHaveAttribute('href', '/productos');
  });
});