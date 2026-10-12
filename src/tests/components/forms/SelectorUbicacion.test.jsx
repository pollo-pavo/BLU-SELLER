import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectorUbicacion from '../../../components/forms/selectorUbicacion';

vi.mock('../../../data/ubicaciones.json', () => ({
  default: {
    regiones: [
      { region: 'Valparaíso', comunas: ['Viña del Mar', 'Quilpué'] },
      { region: 'Metropolitana', comunas: ['Paine', 'Santiago'] },
    ],
  },
}));

describe('SelectorUbicacion', () => {
  it('habilita las comunas al elegir una región y avisa cada cambio con onCambio', async () => {
    const user = userEvent.setup();
    const onCambio = vi.fn();

    render(<SelectorUbicacion onCambio={onCambio} />);

    const botonRegion = screen.getByRole('button', { name: 'Regiones' });
    const botonComuna = screen.getByRole('button', { name: 'Comunas' });

    expect(botonComuna).toBeDisabled();
    expect(onCambio).not.toHaveBeenCalled();

    await user.click(botonRegion);
    await user.click(screen.getByText('Valparaíso'));

    expect(botonRegion).toHaveTextContent('Valparaíso');
    expect(botonComuna).toBeEnabled();
    expect(onCambio).toHaveBeenLastCalledWith({ region: 'Valparaíso', comuna: null });

    await user.click(botonComuna);
    await user.click(screen.getByText('Viña del Mar'));

    expect(botonComuna).toHaveTextContent('Viña del Mar');
    expect(onCambio).toHaveBeenLastCalledWith({ region: 'Valparaíso', comuna: 'Viña del Mar' });

    await user.click(botonRegion);
    await user.click(screen.getByText('Metropolitana'));

    expect(botonRegion).toHaveTextContent('Metropolitana');
    expect(botonComuna).toHaveTextContent('Comunas');
    expect(onCambio).toHaveBeenLastCalledWith({ region: 'Metropolitana', comuna: null });

    expect(onCambio).toHaveBeenCalledTimes(3);
  });
});