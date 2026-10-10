import { Outlet } from 'react-router-dom';
import BarraNavegacion from './navbar';

function LayoutPublico() {
  return (
    <>
      <BarraNavegacion />
      <Outlet />
    </>
  );
}

export default LayoutPublico;