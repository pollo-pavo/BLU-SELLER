import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from '../pages/Blogs';
import { obtenerBlogs } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerBlogs: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('Blogs', () => {
  it('carga y muestra la lista de blogs con su enlace a cada detalle', async () => {
    obtenerBlogs.mockResolvedValue([
      { id: 1, titulo: 'Cómo cuidar tu teclado', descripcion: 'Consejos de limpieza y mantención.' },
      { id: 2, titulo: 'Guía para elegir un mouse', descripcion: 'Qué mirar antes de comprar.' },
    ]);

    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'NOTICIAS IMPORTANTES', level: 2 })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();

    const titulos = await screen.findAllByRole('heading', { level: 3 });
    expect(titulos).toHaveLength(2);
    expect(titulos[0]).toHaveTextContent('Cómo cuidar tu teclado');
    expect(titulos[1]).toHaveTextContent('Guía para elegir un mouse');
    expect(obtenerBlogs).toHaveBeenCalledTimes(1);

    expect(screen.getByText('Consejos de limpieza y mantención.')).toBeInTheDocument();
    expect(screen.getByText('Qué mirar antes de comprar.')).toBeInTheDocument();

    const enlaces = screen.getAllByRole('button', { name: 'VER CASO' });
    expect(enlaces).toHaveLength(2);
    expect(enlaces[0]).toHaveAttribute('href', '/blogs/1');
    expect(enlaces[1]).toHaveAttribute('href', '/blogs/2');
  });
});