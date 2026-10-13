import HeaderGeneral from '../components/layout/HeaderGeneral';
import '../styles/General.css';
import '../styles/Nosotros.css';

function Nosotros() {
  return (
    <>
      <HeaderGeneral />

      <div className="fondo-pagina nosotros-contenido">
        <div className="nosotros-texto">
          <h2 className='titulo-pagina'>Nosotros</h2>
            <p className='texto-pagina'>
            Para usted este proyecto venta de blu-rays de la mano de Miguel Gonzalez y Esteban
            Orellana, estudiantes de DUOC UC, como parte de la asignatura
            Desarrollo Fullstack II.
          </p>
        </div>

        <div className="nosotros-imagen"></div>
      </div>
    </>
  );
}

export default Nosotros;