import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PanelAdmin from '../../pages/admin/PanelAdmin';
import { adminObtenerDashboard } from '../../services/api';

vi.mock('../../services/api', () => ({
  adminObtenerDashboard: vi.fn(),
}));

describe('PanelAdmin', () => {
  it('muestra "Cargando..." y luego el resumen, las órdenes y los productos críticos', async () => {
    adminObtenerDashboard.mockResolvedValue({
      ventas_totales: 3500000,
      ordenes: 45,
      pendientes: 7,
      usuarios: 12,
      ultimas_ordenes: [
        { id: 101, cliente: 'Ana Pérez', estado: 'Pendiente', total: 25990 },
      ],
      productos_criticos: [
        { id: 1, nombre: 'Mouse Gamer', stock: 0, stock_critico: 5 },
      ],
    });

    render(
      <MemoryRouter>
        <PanelAdmin />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: '¡HOLA Administrador!' })).toBeInTheDocument();
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    expect(adminObtenerDashboard).toHaveBeenCalledTimes(1);

    expect(screen.getByText('$3.500.000')).toBeInTheDocument();

    const [tablaOrdenes, tablaCriticos] = screen.getAllByRole('table');
    expect(within(tablaOrdenes).getByRole('link', { name: '#101' })).toHaveAttribute('href', '/admin/ordenes/101');
    expect(within(tablaOrdenes).getByText('Ana Pérez')).toBeInTheDocument();
    expect(within(tablaOrdenes).getByText('$25.990')).toBeInTheDocument();

    expect(within(tablaCriticos).getByText('Mouse Gamer')).toBeInTheDocument();
    expect(within(tablaCriticos).getByText('0')).toHaveClass('agotado');

    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveAttribute('href', '/admin/ordenes');
    expect(screen.getByRole('link', { name: 'Ver todos' })).toHaveAttribute('href', '/admin/productos/criticos');
  });
});