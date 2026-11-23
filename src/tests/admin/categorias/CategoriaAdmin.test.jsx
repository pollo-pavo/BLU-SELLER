import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CategoriaAdmin from '../../../pages/admin/categorias/CategoriaAdmin';
import { obtenerCategorias, adminEliminarCategoria } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  obtenerCategorias: vi.fn(),
  adminEliminarCategoria: vi.fn(),
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

  it('elimina una categoría tras confirmar y la quita de la tabla', async () => {
    obtenerCategorias.mockResolvedValue([{ id: 1, nombre: 'Bebidas' }, { id: 2, nombre: 'Snacks' }]);
    adminEliminarCategoria.mockResolvedValue({ ok: true });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<MemoryRouter><CategoriaAdmin /></MemoryRouter>);
    await screen.findByText('Bebidas');

    const fila = screen.getByText('Bebidas').closest('tr');
    await userEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(adminEliminarCategoria).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.queryByText('Bebidas')).not.toBeInTheDocument());
    expect(screen.getByText('Snacks')).toBeInTheDocument();
  });

  it('no elimina si el usuario cancela la confirmación', async () => {
    obtenerCategorias.mockResolvedValue([{ id: 1, nombre: 'Bebidas' }]);
    adminEliminarCategoria.mockClear();
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<MemoryRouter><CategoriaAdmin /></MemoryRouter>);
    await screen.findByText('Bebidas');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(adminEliminarCategoria).not.toHaveBeenCalled();
    expect(screen.getByText('Bebidas')).toBeInTheDocument();
  });
});
