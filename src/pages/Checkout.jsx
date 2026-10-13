import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { regiones } from '../data/regiones';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { crearOrden } from '../services/api';
import '../styles/Checkout.css';
import { PATRON_CORREO, TEXTO_CORREO } from '../utils/validaciones';
import { useState } from 'react';

function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrecio: total, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const [region, setRegion] = useState(usuario?.region ?? '');
  const [comuna, setComuna] = useState(usuario?.comuna ?? '');
  const comunas = regiones.find((r) => r.nombre === region)?.comunas ?? [];

  const pagar = async (e) => {
    e.preventDefault();
    const c = e.target.elements;
    const datos = {
      usuario_id: usuario?.id,
      nombre: c.nombre.value,
      apellidos: c.apellidos.value,
      correo: c.correo.value,
      calle: c.calle.value,
      departamento: c.departamento.value,
      region: c.region.value,
      comuna: c.comuna.value,
      indicaciones: c.indicaciones.value,
    };

    try {
      const orden = await crearOrden({
        ...datos,
        items: items.map((i) => ({ id: i.id, cantidad: i.cantidad })),
      });
      navigate(`/pago-correcto?orden=${orden.id}`);
      vaciar();
    } catch (err) {
      navigate('/pago-error', { state: { mensaje: err.message, compra: { ...datos, items } } });
    }
  };

  if (items.length === 0) {
    return (
      <Container className="checkout">
        <p>Tu carrito está vacío.</p>
        <Link to="/productos">Ver productos</Link>
      </Container>
    );
  }

  return (
    <Container className="checkout">
      <Form className="checkout-tarjeta" onSubmit={pagar}>
        <div className="checkout-encabezado">
          <div>
            <h1>Carrito de compra</h1>
            <p>Completa la siguiente información</p>
          </div>
          <span className="checkout-total">Total a pagar: ${total.toLocaleString('es-CL')}</span>
        </div>

        <Table size="sm" className="checkout-tabla">
          <thead>
            <tr>
              <th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td><div className="checkout-imagen" /></td>
                <td>{i.nombre}</td>
                <td>${i.precio.toLocaleString('es-CL')}</td>
                <td>{i.cantidad}</td>
                <td>${(i.precio * i.cantidad).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h2>Información del cliente</h2>
        <p className="checkout-ayuda">Completa la siguiente información</p>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="text" required maxLength={75} defaultValue={usuario?.nombre ?? ''} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="apellidos">
              <Form.Label>Apellidos<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="text" required maxLength={75} defaultValue={usuario?.apellidos ?? ''} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="email" required maxLength={100} pattern={PATRON_CORREO} title={TEXTO_CORREO} defaultValue={usuario?.correo ?? ''} />
            </Form.Group>
          </Col>
        </Row>

        <h2>Dirección de entrega de los productos</h2>
        <p className="checkout-ayuda">Ingrese dirección de forma detallada</p>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="calle">
              <Form.Label>Calle<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="text" required maxLength={300} defaultValue={usuario?.direccion ?? ''} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="departamento">
              <Form.Label>Departamento (opcional)</Form.Label>
              <Form.Control type="text" placeholder="Ej: 603" maxLength={50} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="region">
              <Form.Label>Región<span className="checkout-req">*</span></Form.Label>
              <Form.Select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setComuna('');
                }}
                required
              >
                <option value="" disabled>-- Seleccione la región --</option>
                {regiones.map((r) => (
                  <option key={r.nombre}>{r.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="comuna">
              <Form.Label>Comuna<span className="checkout-req">*</span></Form.Label>
              <Form.Select value={comuna} onChange={(e) => setComuna(e.target.value)} required>
                <option value="" disabled>-- Seleccione la comuna --</option>
                {comunas.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="indicaciones">
          <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={300}
            placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
          />
        </Form.Group>

        <div className="checkout-pagar">
          <Button type="submit" variant="success">
            Pagar ahora ${total.toLocaleString('es-CL')}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Checkout;