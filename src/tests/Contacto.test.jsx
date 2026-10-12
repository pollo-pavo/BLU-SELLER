import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '../pages/Contacto';

vi.mock('../components/layout/HeaderGeneral', () => ({
  default: () => <header>Header de prueba</header>,
}));

describe('Contacto', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('envía el formulario a la API, avisa al usuario y limpia los campos', async () => {
    const user = userEvent.setup();

    const fetchFalso = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchFalso);

    const alertaSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Contacto />);

    expect(screen.getByText('Header de prueba')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Formulario de contacto' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo'), 'ana@duoc.cl');
    await user.type(screen.getByLabelText('Contenido'), 'Hola, tengo una consulta sobre mi pedido.');
    await user.click(screen.getByRole('button', { name: 'ENVIAR' }));

    await waitFor(() => expect(fetchFalso).toHaveBeenCalledTimes(1));
    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe('/api/contacto');
    expect(opciones.method).toBe('POST');
    expect(JSON.parse(opciones.body)).toEqual({
      nombre: 'Ana Pérez',
      correo: 'ana@duoc.cl',
      contenido: 'Hola, tengo una consulta sobre mi pedido.',
    });

    await waitFor(() => expect(alertaSpy).toHaveBeenCalledWith('Mensaje enviado correctamente'));
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
    expect(screen.getByLabelText('Correo')).toHaveValue('');
    expect(screen.getByLabelText('Contenido')).toHaveValue('');
  });
});