import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { regiones } from '../data/regiones';
import '../styles/Checkout.css';

const items = [
  { id: 1, nombre: 'ejemplo 1', precio: 2695, cantidad: 4 },
  { id: 2, nombre: 'ejemplo 2', precio: 5999, cantidad: 1 },
  { id: 3, nombre: 'ejemplo 3', precio: 499, cantidad: 1 },
  { id: 4, nombre: 'ejemplo 4', precio: 3999, cantidad: 1 },
];
const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

function Checkout() {
  const comunas = regiones.flatMap((r) => r.comunas);

  return (
    <Container className="checkout">
      <Form className="checkout-tarjeta" onSubmit={(e) => e.preventDefault()}>
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
              <Form.Control type="text" required maxLength={75} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="apellidos">
              <Form.Label>Apellidos<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="text" required maxLength={75} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="email" required maxLength={100} />
            </Form.Group>
          </Col>
        </Row>

        <h2>Dirección de entrega de los productos</h2>
        <p className="checkout-ayuda">Ingrese dirección de forma detallada</p>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="calle">
              <Form.Label>Calle<span className="checkout-req">*</span></Form.Label>
              <Form.Control type="text" required maxLength={300} />
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
              <Form.Select defaultValue="" required>
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
              <Form.Select defaultValue="" required>
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