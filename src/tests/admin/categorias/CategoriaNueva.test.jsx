import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoriaNueva from '../../../pages/admin/categorias/CategoriaNueva';
import { adminCrearCategoria } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminCrearCategoria: vi.fn(),
}));

describe('CategoriaNueva', () => {
  it('permite escribir el nombre, crea la categoría y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    adminCrearCategoria.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/categorias/nueva']}>
        <Routes>
          <Route path="/admin/categorias/nueva" element={<CategoriaNueva />} />
          <Route path="/admin/categorias" element={<p>Listado de categorías</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'NUEVA CATEGORÍA' })).toBeInTheDocument();
    const input = screen.getByLabelText('NOMBRE');
    expect(input).toHaveValue('');

    await user.type(input, 'Lácteos');
    await user.click(screen.getByRole('button', { name: 'GUARDAR' }));

    expect(adminCrearCategoria).toHaveBeenCalledWith({ nombre: 'Lácteos' });
    expect(alertSpy).toHaveBeenCalledWith('Categoría creada correctamente');
    expect(await screen.findByText('Listado de categorías')).toBeInTheDocument();
  });
});