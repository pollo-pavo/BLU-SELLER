import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CategoriaEditar from '../../../pages/admin/categorias/CategoriaEditar';
import {
  adminObtenerCategoria,
  adminActualizarCategoria,
} from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerCategoria: vi.fn(),
  adminActualizarCategoria: vi.fn(),
}));

describe('CategoriaEditar', () => {
  it('carga la categoría, permite cambiar el nombre, la actualiza y vuelve al listado', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    adminObtenerCategoria.mockResolvedValue({ id: 7, nombre: 'Bebidas' });
    adminActualizarCategoria.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/admin/categorias/7/editar']}>
        <Routes>
          <Route path="/admin/categorias/:id/editar" element={<CategoriaEditar />} />
          <Route path="/admin/categorias" element={<p>Listado de categorías</p>} />
        </Routes>
      </MemoryRouter>
    );

    // Mientras carga se muestra el mensaje de espera
    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    // Al cargar, el formulario aparece con los datos de la categoría
    const input = await screen.findByLabelText('NOMBRE');
    expect(adminObtenerCategoria).toHaveBeenCalledWith('7');
    expect(screen.getByText('Editar categoría #7')).toBeInTheDocument();
    expect(input).toHaveValue('Bebidas');

    // El usuario cambia el nombre y envía el formulario
    await user.clear(input);
    await user.type(input, 'Jugos');
    await user.click(screen.getByRole('button', { name: 'ACTUALIZAR' }));

    // Se envía el nuevo nombre, se avisa al usuario y se redirige al listado
    expect(adminActualizarCategoria).toHaveBeenCalledWith('7', { nombre: 'Jugos' });
    expect(alertSpy).toHaveBeenCalledWith('Categoría actualizada correctamente');
    expect(await screen.findByText('Listado de categorías')).toBeInTheDocument();
  });
});