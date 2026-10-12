import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductosReportes from '../../../pages/admin/productos/ProductosReportes';
import { adminObtenerReporteProductos } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  adminObtenerReporteProductos: vi.fn(),
}));

const valorDe = (etiqueta) => screen.getByText(etiqueta).nextElementSibling;

describe('ProductosReportes', () => {
  it('carga el reporte y muestra cada indicador en su tarjeta con el valor del inventario formateado', async () => {
    adminObtenerReporteProductos.mockResolvedValue({
      total: 48,
      stock_total: 320,
      valor_inventario: 1250000,
      criticos: 7,
    });

    render(<ProductosReportes />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', { name: 'Reporte de productos' })
    ).toBeInTheDocument();
    expect(adminObtenerReporteProductos).toHaveBeenCalledTimes(1);

    expect(valorDe('Productos')).toHaveTextContent('48');
    expect(valorDe('Unidades en stock')).toHaveTextContent('320');
    expect(valorDe('Valor del inventario')).toHaveTextContent('$1.250.000');
    expect(valorDe('En estado crítico')).toHaveTextContent('7');
  });
});