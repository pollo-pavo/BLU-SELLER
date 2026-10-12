import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BlogDetalle from '../pages/BlogDetalle';
import { obtenerBlog } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerBlog: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('BlogDetalle', () => {
  it('carga el blog según el id de la URL y muestra su contenido', async () => {
    const fechaCreacion = '2026-03-15T12:00:00';
    obtenerBlog.mockResolvedValue({
      id: 7,
      titulo: 'Cómo cuidar tu teclado mecánico',
      autor: 'Ana Pérez',
      fecha_creacion: fechaCreacion,
      contenido: 'Limpia tu teclado cada mes para que dure más.',
    });

    render(
      <MemoryRouter initialEntries={['/blogs/7']}>
        <Routes>
          <Route path="/blogs/:id" element={<BlogDetalle />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Cómo cuidar tu teclado mecánico', level: 2 })
    ).toBeInTheDocument();

    expect(obtenerBlog).toHaveBeenCalledWith('7');

    const fechaEsperada = new Date(fechaCreacion).toLocaleDateString('es-CL');
    expect(screen.getByText(`Por Ana Pérez · ${fechaEsperada}`)).toBeInTheDocument();

    expect(screen.getByText('Limpia tu teclado cada mes para que dure más.')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs');
  });
});