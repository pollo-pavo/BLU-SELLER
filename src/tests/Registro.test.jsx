import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../pages/Registro';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => navigate,
}));

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

vi.mock('../components/forms/selectorUbicacion.jsx', () => ({
  default: ({ onCambio }) => (
    <button
      type="button"
      onClick={() => onCambio({ region: 'Metropolitana', comuna: 'Paine' })}
    >
      Elegir ubicación
    </button>
  ),
}));

describe('Registro', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rechaza un RUN inválido y, con los datos correctos, registra al usuario y va al inicio de sesión', async () => {
    const user = userEvent.setup();

    const fetchFalso = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchFalso);

    const alertaSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Registro de usuario' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('RUN'), '123456789');
    await user.type(screen.getByLabelText('Nombre'), 'Ana');
    await user.type(screen.getByLabelText('Apellidos'), 'Pérez Soto');
    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'clave1234');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'clave1234');
    await user.type(screen.getByLabelText('Telefono(Opcional)'), '987654321');
    await user.type(screen.getByLabelText('Dirección'), 'Av. Siempre Viva 742');
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));

    expect(alertaSpy).toHaveBeenCalledWith(expect.stringContaining('El RUN es inválido'));
    expect(fetchFalso).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();

    const run = screen.getByLabelText('RUN');
    await user.clear(run);
    await user.type(run, '123456785');
    await user.click(screen.getByRole('button', { name: 'Elegir ubicación' }));
    await user.click(screen.getByRole('button', { name: 'Regístrate' }));

    await waitFor(() => expect(fetchFalso).toHaveBeenCalledTimes(1));
    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe('/api/registro');
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({
      run: '123456785',
      nombre: 'Ana',
      apellidos: 'Pérez Soto',
      correo: 'ana@duoc.cl',
      contrasena: 'clave1234',
      fecha_nacimiento: '',
      telefono: '987654321',
      direccion: 'Av. Siempre Viva 742',
      region: 'Metropolitana',
      comuna: 'Paine',
    });

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/InicioSesion'));
    expect(alertaSpy).toHaveBeenCalledTimes(1);
  });
});