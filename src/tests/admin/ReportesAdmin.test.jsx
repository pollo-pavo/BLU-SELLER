import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ReportesAdmin from '../../pages/admin/ReportesAdmin';
import { adminObtenerReportes } from '../../services/api';

vi.mock('../../services/api', () => ({
  adminObtenerReportes: vi.fn(),
}));

const tarjeta = (etiqueta) =>
  screen.getByText(etiqueta, { selector: 'span' }).parentElement;

describe('ReportesAdmin', () => {
  it('muestra "Cargando..." y luego las tarjetas y las tablas del reporte', async () => {
    adminObtenerReportes.mockResolvedValue({
      ventas_totales: 3500000,
      ordenes: 45,
      ticket_promedio: 77777,
      clientes: 12,
      por_estado: [
        { estado: 'Pendiente', cantidad: 7 },
        { estado: 'Enviada', cantidad: 38 },
      ],
      mas_vendidos: [
        { id: 1, nombre: 'Mouse Gamer', unidades: 120 },
        { id: 2, nombre: 'Teclado Mecánico', unidades: 80 },
      ],
    });

    render(<ReportesAdmin />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Reportes', level: 1 })).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    expect(adminObtenerReportes).toHaveBeenCalledTimes(1);

    expect(tarjeta('Ventas totales')).toHaveTextContent('$3.500.000');
    expect(tarjeta('Órdenes')).toHaveTextContent('45');
    expect(tarjeta('Ticket promedio')).toHaveTextContent('$77.777');
    expect(tarjeta('Clientes')).toHaveTextContent('12');

    expect(screen.getByRole('heading', { name: 'Órdenes por estado', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Productos más vendidos', level: 2 })).toBeInTheDocument();

    const [tablaEstados, tablaVendidos] = screen.getAllByRole('table');

    expect(within(tablaEstados).getAllByRole('row')).toHaveLength(3);
    expect(within(tablaEstados).getByText('Pendiente')).toBeInTheDocument();
    expect(within(tablaEstados).getByText('7')).toBeInTheDocument();
    expect(within(tablaEstados).getByText('Enviada')).toBeInTheDocument();
    expect(within(tablaEstados).getByText('38')).toBeInTheDocument();

    expect(within(tablaVendidos).getAllByRole('row')).toHaveLength(3);
    expect(within(tablaVendidos).getByText('Mouse Gamer')).toBeInTheDocument();
    expect(within(tablaVendidos).getByText('120')).toBeInTheDocument();
    expect(within(tablaVendidos).getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(within(tablaVendidos).getByText('80')).toBeInTheDocument();
  });
});