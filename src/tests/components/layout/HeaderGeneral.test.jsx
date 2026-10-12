import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HeaderGeneral from '../../../components/layout/HeaderGeneral';
import { useCarrito } from '../../../context/CarritoContext';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../../../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

describe('HeaderGeneral', () => {
  it('muestra la marca, el carrito y el buscador, y navega según lo que se busca', async () => {
    const user = userEvent.setup();
    useCarrito.mockReturnValue({ cantidadTotal: 3 });

    const { rerender } = render(
      <MemoryRouter>
        <HeaderGeneral />
      </MemoryRouter>
    );

    expect(screen.getByRole('img', { name: 'Logo' })).toHaveAttribute('src', '/imagenes/logo.png');
    expect(screen.getByRole('heading', { name: 'BLU-SELLER' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Carrito (3)' })).toHaveAttribute('href', '/carrito');

    const buscador = screen.getByRole('searchbox');
    await user.type(buscador, '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(navigate).toHaveBeenLastCalledWith('/productos');

    await user.clear(buscador);
    await user.type(buscador, ' mouse gamer ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(navigate).toHaveBeenLastCalledWith('/productos?buscar=mouse%20gamer');
    expect(navigate).toHaveBeenCalledTimes(2);

    rerender(
      <MemoryRouter>
        <HeaderGeneral carrito={false} />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'BLU-SELLER' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Buscar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Carrito/ })).not.toBeInTheDocument();
  });
});