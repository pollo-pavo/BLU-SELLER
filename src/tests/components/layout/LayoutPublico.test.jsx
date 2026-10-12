import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LayoutPublico from '../../../components/layout/LayoutPublico';

vi.mock('../../../components/layout/navbar', () => ({
  default: () => <nav>Barra de navegación</nav>,
}));

describe('LayoutPublico', () => {
  it('muestra la barra de navegación y, debajo, el contenido de la ruta hija', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<LayoutPublico />}>
            <Route index element={<p>Contenido de la página</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const barra = screen.getByRole('navigation');
    const contenido = screen.getByText('Contenido de la página');

    expect(barra).toHaveTextContent('Barra de navegación');
    expect(contenido).toBeInTheDocument();

    expect(barra.compareDocumentPosition(contenido)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});