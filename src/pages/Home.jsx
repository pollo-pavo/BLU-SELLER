import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';

function Home() {
  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina">
        <h2 className="titulo-pagina">INICIO</h2>
        <p>Bienvenido a mi aplicación.</p>
      </div>
    </>
  );
}

export default Home;