import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ResumenCompra from '../../../components/ui/ResumenCompra';

const compra = {
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@correo.cl',
  calle: 'Av. Siempre Viva 742',
  departamento: '12B',
  region: 'Metropolitana',
  comuna: 'Providencia',
  indicaciones: 'Dejar en conserjería',
  items: [
    { id: 1, nombre: 'Zapatillas Runner', precio: 12500, cantidad: 2 },
    { id: 2, nombre: 'Mochila Urbana', precio: 15000, cantidad: 1 },
  ],
};

describe('ResumenCompra', () => {
  it('muestra los datos del cliente y de la entrega en solo lectura, el detalle de productos y el total', () => {
    render(<ResumenCompra compra={compra} />);

    const nombre = screen.getByLabelText(/^Nombre/);
    expect(nombre).toHaveValue('Ana');
    expect(screen.getByLabelText(/^Apellidos/)).toHaveValue('Pérez');
    expect(screen.getByLabelText(/^Correo/)).toHaveValue('ana@correo.cl');
    expect(nombre).toHaveAttribute('readonly');

    expect(
      screen.getByRole('heading', { name: 'Dirección de entrega de los productos' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Calle/)).toHaveValue('Av. Siempre Viva 742');
    expect(screen.getByLabelText('Departamento (opcional)')).toHaveValue('12B');
    expect(screen.getByLabelText(/^Región/)).toHaveDisplayValue('Metropolitana');
    expect(screen.getByLabelText(/^Región/)).toBeDisabled();
    expect(screen.getByLabelText(/^Comuna/)).toHaveDisplayValue('Providencia');
    expect(screen.getByLabelText(/^Comuna/)).toBeDisabled();
    expect(screen.getByLabelText('Indicaciones para la entrega (opcional)')).toHaveValue(
      'Dejar en conserjería'
    );

    ['Imagen', 'Nombre', 'Precio', 'Cantidad', 'Subtotal'].forEach((encabezado) => {
      expect(screen.getByRole('columnheader', { name: encabezado })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const fila1 = screen.getByText('Zapatillas Runner').closest('tr');
    expect(within(fila1).getByText('$12.500')).toBeInTheDocument();
    expect(within(fila1).getByText('2')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.000')).toBeInTheDocument();

    const fila2 = screen.getByText('Mochila Urbana').closest('tr');
    expect(within(fila2).getByText('1')).toBeInTheDocument();
    expect(within(fila2).getAllByText('$15.000')).toHaveLength(2);

    expect(screen.getByText('Total pagado: $40.000')).toBeInTheDocument();
  });
});