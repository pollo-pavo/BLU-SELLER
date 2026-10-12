import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InicioSesion from '../pages/InicioSesion';
import { useAuth } from '../context/AuthContext';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('InicioSesion', () => {
  it('muestra un error con credenciales inválidas y redirige al panel si el login es de un admin', async () => {
    const user = userEvent.setup();

    const iniciarSesion = vi
      .fn()
      .mockRejectedValueOnce(new Error('Credenciales inválidas'))
      .mockResolvedValueOnce({ id: 1, rol: 'admin' });
    useAuth.mockReturnValue({ iniciarSesion });

    render(
      <MemoryRouter>
        <InicioSesion />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Inicio de Sesión' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '¿No tienes una cuenta? Regístrate' })).toHaveAttribute('href', '/registro');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'clave-incorrecta');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos');
    expect(iniciarSesion).toHaveBeenCalledWith('ana@duoc.cl', 'clave-incorrecta');
    expect(navigate).not.toHaveBeenCalled();

    const contrasena = screen.getByLabelText('Contraseña');
    await user.clear(contrasena);
    await user.type(contrasena, 'clave-correcta');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/admin/dashboard'));
    expect(iniciarSesion).toHaveBeenCalledTimes(2);
    expect(iniciarSesion).toHaveBeenLastCalledWith('ana@duoc.cl', 'clave-correcta');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});