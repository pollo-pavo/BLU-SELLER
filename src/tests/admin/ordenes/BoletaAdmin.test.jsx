import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BoletaAdmin from '../../../pages/admin/ordenes/BoletaAdmin';
import { obtenerOrden } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  obtenerOrden: vi.fn(),
}));

describe('BoletaAdmin', () => {
  it('carga la orden y muestra los datos del cliente, los productos con sus montos y el total', async () => {
    const fecha = '2026-10-05T15:00:00';
    obtenerOrden.mockResolvedValue({
      id: 9,
      fecha_creacion: fecha,
      estado: 'pagada',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@correo.cl',
      calle: 'Av. Siempre Viva 742',
      departamento: '12B',
      comuna: 'Providencia',
      region: 'Metropolitana',
      indicaciones: 'Dejar en conserjería',
      total: '40000',
      items: [
        { nombre: 'Zapatillas', cantidad: 2, precio_unitario: '12500' },
        { nombre: 'Mochila', cantidad: 1, precio_unitario: '15000' },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/admin/ordenes/9']}>
        <Routes>
          <Route path="/admin/ordenes/:id" element={<BoletaAdmin />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Boleta #9' })).toBeInTheDocument();
    expect(obtenerOrden).toHaveBeenCalledWith('9');

    expect(screen.getByText(new Date(fecha).toLocaleDateString('es-CL'))).toBeInTheDocument();
    expect(screen.getByText('pagada')).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('ana@correo.cl')).toBeInTheDocument();
    expect(
      screen.getByText('Av. Siempre Viva 742, depto 12B, Providencia, Metropolitana')
    ).toBeInTheDocument();
    expect(screen.getByText('Dejar en conserjería')).toBeInTheDocument();

    const filaZapatillas = screen.getByText('Zapatillas').closest('tr');
    expect(within(filaZapatillas).getByText('2')).toBeInTheDocument();
    expect(within(filaZapatillas).getByText('$12.500')).toBeInTheDocument();
    expect(within(filaZapatillas).getByText('$25.000')).toBeInTheDocument();

    const filaMochila = screen.getByText('Mochila').closest('tr');
    expect(within(filaMochila).getByText('1')).toBeInTheDocument();
    expect(within(filaMochila).getAllByText('$15.000')).toHaveLength(2);

    expect(screen.getByText('$40.000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver a órdenes' })).toHaveAttribute(
      'href',
      '/admin/ordenes'
    );
  });
});