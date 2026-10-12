import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PagoCorrecto from '../pages/PagoCorrecto';
import { obtenerOrden } from '../services/api';

vi.mock('../services/api', () => ({
  obtenerOrden: vi.fn(),
}));

vi.mock('../components/ui/ResumenCompra', () => ({
  default: ({ compra }) => (
    <section aria-label="Resumen de compra">{JSON.stringify(compra)}</section>
  ),
}));

describe('PagoCorrecto', () => {
  it('carga la orden indicada en la URL y muestra la confirmación con su resumen', async () => {
    obtenerOrden.mockResolvedValue({
      id: 42,
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@duoc.cl',
      calle: 'Av. Siempre Viva 742',
      departamento: null,
      region: 'Metropolitana',
      comuna: 'Paine',
      indicaciones: null,
      items: [
        { producto_id: 7, nombre: 'Mouse Gamer', precio_unitario: '25990.00', cantidad: 2 },
        { nombre: 'Teclado Mecánico', precio_unitario: '40000', cantidad: 1 },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/pago-correcto?orden=42']}>
        <PagoCorrecto />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByText('Código orden: ORDER00042')).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Se ha realizado la compra\. nro #42/ })).toBeInTheDocument();

    expect(obtenerOrden).toHaveBeenCalledWith('42');

    expect(screen.getByRole('button', { name: 'Imprimir boleta en PDF' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar boleta por email' })).toBeInTheDocument();

    const resumen = screen.getByRole('region', { name: 'Resumen de compra' });
    expect(JSON.parse(resumen.textContent)).toEqual({
      nro: 42,
      codigoOrden: 'ORDER00042',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@duoc.cl',
      calle: 'Av. Siempre Viva 742',
      departamento: '',
      region: 'Metropolitana',
      comuna: 'Paine',
      indicaciones: '',
      items: [
        { id: 7, nombre: 'Mouse Gamer', precio: 25990, cantidad: 2 },
        { id: 1, nombre: 'Teclado Mecánico', precio: 40000, cantidad: 1 },
      ],
    });
  });
});