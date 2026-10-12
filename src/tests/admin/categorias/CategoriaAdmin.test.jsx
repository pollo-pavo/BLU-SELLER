import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoriaAdmin from '../../../pages/admin/categorias/CategoriaAdmin';
import { obtenerCategorias } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  obtenerCategorias: vi.fn(),
}));

describe('CategoriaAdmin', () => {
  it('muestra las categorías obtenidas con sus enlaces de edición y el botón de nueva categoría', async () => {
    const categorias = [
      { id: 1, nombre: 'Bebidas' },
      { id: 2, nombre: 'Snacks' },
    ];
    obtenerCategorias.mockResolvedValue(categorias);

    render(
      <MemoryRouter>
        <CategoriaAdmin />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Categorías' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NUEVA CATEGORÍA' })).toHaveAttribute(
      'href',
      '/admin/categorias/nueva'
    );

    await screen.findByText('Bebidas');

    categorias.forEach(({ id, nombre }) => {
      const fila = screen.getByText(nombre).closest('tr');
      expect(within(fila).getByText(String(id))).toBeInTheDocument();
      expect(within(fila).getByRole('link', { name: 'Editar' })).toHaveAttribute(
        'href',
        `/admin/categorias/${id}/editar`
      );
    });
  });
});
