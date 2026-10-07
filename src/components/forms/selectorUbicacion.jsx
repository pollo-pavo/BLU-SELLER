import {useState, useEffect} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import datos from '../../data/ubicaciones.json';

function SelectorUbicacion() {
    
    const [regionSeleccionada, setRegionSeleccionada] = useState(null);
    const [comunaSeleccionada, setComunaSeleccionada] = useState(null);

    const seleccionarRegion = (region) => {
        setRegionSeleccionada(region);
        setComunaSeleccionada(null);
    }

    return (
        <div className="d-flex justify-content-center align-items-center gap-2">

            <Dropdown>

                <Dropdown.Toggle variant="secondary">
                    {regionSeleccionada ? regionSeleccionada.region : "Regiones"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu">

                    {datos.regiones.map((region) => (
                        <Dropdown.Item
                            key={region.region}
                            onClick={() => seleccionarRegion(region)}
                        >
                            {region.region}
                        </Dropdown.Item>
                    ))}

                </Dropdown.Menu>

            </Dropdown>


            <Dropdown>

                <Dropdown.Toggle variant="secondary" disabled={!regionSeleccionada}>
                    {comunaSeleccionada ? comunaSeleccionada : "Comunas"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="menu">

                    {regionSeleccionada?.comunas.map((comuna) => (
                        <Dropdown.Item
                            key={comuna}
                            onClick={() => setComunaSeleccionada(comuna)}
                        >
                            {comuna}
                        </Dropdown.Item>
                    ))}

                </Dropdown.Menu>
            </Dropdown>

        </div>
    );
}

export default SelectorUbicacion;