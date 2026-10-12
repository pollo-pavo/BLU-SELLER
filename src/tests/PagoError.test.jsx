import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PagoError from '../pages/PagoError';

vi.mock('../components/ui/ResumenCompra', () => ({
  default: ({ compra }) => (
    <section aria-label="Resumen de compra">{JSON.stringify(compra)}</section>
  ),
}));

describe('PagoError', () => {
  it('muestra el error del pago, el enlace para reintentar y el resumen de la compra', () => {
    const compra = {
      nombre: 'Ana',
      apellidos: 'Pérez',
      items: [{ id: 1, nombre: 'Mouse Gamer', precio: 25990, cantidad: 2 }],
    };

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/pago-error', state: { mensaje: 'Stock insuficiente', compra } },
        ]}
      >
        <PagoError />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /No se pudo realizar el pago\./ })).toBeInTheDocument();
    expect(screen.getByText('Stock insuficiente')).toBeInTheDocument();
    expect(screen.queryByText('Detalle de compra')).not.toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'VOLVER A REALIZAR EL PAGO' })).toHaveAttribute('href', '/checkout');

    const resumen = screen.getByRole('region', { name: 'Resumen de compra' });
    expect(JSON.parse(resumen.textContent)).toEqual(compra);
  });
});