import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductosAdmin from '../../../pages/admin/productos/ProductosAdmin';
import { adminObtenerProductos, adminEliminarProducto } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../utils/roles';

vi.mock('../../../services/api', () => ({
  adminObtenerProductos: vi.fn(),
  adminEliminarProducto: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const productos = [
  { id: 1, codigo: 'MS-001', nombre: 'Mouse Gamer', categoria: 'Mouses', precio: '25990.00', stock: 15 },
  { id: 2, codigo: 'TC-002', nombre: 'Teclado Mecánico', categoria: null, precio: 1250000, stock: 3 },
];

const renderizar = () =>
  render(
    <MemoryRouter>
      <ProductosAdmin />
    </MemoryRouter>
  );

describe('ProductosAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminObtenerProductos.mockResolvedValue(productos);
  });

  it('muestra los enlaces del encabezado y la tabla de productos con sus acciones', async () => {
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    renderizar();

    expect(screen.getByRole('heading', { name: 'Productos', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NUEVO PRODUCTO' })).toHaveAttribute('href', '/admin/productos/nuevo');
    expect(screen.getByRole('link', { name: 'CRÍTICOS' })).toHaveAttribute('href', '/admin/productos/criticos');
    expect(screen.getByRole('link', { name: 'REPORTES' })).toHaveAttribute('href', '/admin/productos/reportes');

    for (const nombre of ['Código', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument();
    }

    await screen.findByText('Mouse Gamer');
    expect(adminObtenerProductos).toHaveBeenCalledTimes(1);

    const filas = screen.getAllByRole('row');
    expect(filas).toHaveLength(3);
    const [, fila1, fila2] = filas;

    expect(within(fila1).getByText('MS-001')).toBeInTheDocument();
    expect(within(fila1).getByText('Mouses')).toBeInTheDocument();
    expect(within(fila1).getByText('$25.990')).toBeInTheDocument();
    expect(within(fila1).getByText('15')).toBeInTheDocument();
    expect(within(fila1).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/productos/1');
    expect(within(fila1).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/productos/1/editar');
    expect(within(fila1).getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();

    expect(within(fila2).getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(within(fila2).getByText('-')).toBeInTheDocument();
    expect(within(fila2).getByText('$1.250.000')).toBeInTheDocument();
    expect(within(fila2).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/productos/2');
    expect(within(fila2).getByRole('link', { name: 'Editar' })).toHaveAttribute('href', '/admin/productos/2/editar');
    expect(within(fila2).getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
  });

  it('al vendedor no le muestra crear, editar ni eliminar', async () => {
    useAuth.mockReturnValue({ usuario: { rol: ROLES.VENDEDOR } });
    renderizar();

    await screen.findByText('Mouse Gamer');

    for (const nombre of ['NUEVO PRODUCTO', 'CRÍTICOS', 'REPORTES', 'Editar']) {
      expect(screen.queryByRole('link', { name: nombre })).not.toBeInTheDocument();
    }
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();

    const [, fila1] = screen.getAllByRole('row');
    expect(within(fila1).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/productos/1');
  });

  it('elimina el producto al confirmar y lo saca de la tabla', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    adminEliminarProducto.mockResolvedValue(null);
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderizar();
    await screen.findByText('Mouse Gamer');

    const [, fila1] = screen.getAllByRole('row');
    await user.click(within(fila1).getByRole('button', { name: 'Eliminar' }));

    expect(confirmar).toHaveBeenCalledWith('¿Eliminar "Mouse Gamer"?');
    expect(adminEliminarProducto).toHaveBeenCalledWith(1);
    expect(screen.queryByText('Mouse Gamer')).not.toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);

    confirmar.mockRestore();
  });

  it('no elimina nada si se cancela la confirmación', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderizar();
    await screen.findByText('Mouse Gamer');

    const [, fila1] = screen.getAllByRole('row');
    await user.click(within(fila1).getByRole('button', { name: 'Eliminar' }));

    expect(adminEliminarProducto).not.toHaveBeenCalled();
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);

    confirmar.mockRestore();
  });

  it('muestra el error y conserva la fila si el servidor no deja eliminar', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({ usuario: { rol: ROLES.ADMIN } });
    adminEliminarProducto.mockRejectedValue(new Error('El producto tiene órdenes asociadas'));
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const aviso = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderizar();
    await screen.findByText('Mouse Gamer');

    const [, fila1] = screen.getAllByRole('row');
    await user.click(within(fila1).getByRole('button', { name: 'Eliminar' }));

    expect(aviso).toHaveBeenCalledWith('El producto tiene órdenes asociadas');
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();

    confirmar.mockRestore();
    aviso.mockRestore();
  });
});