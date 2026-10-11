import { Row, Col, Form, Table } from 'react-bootstrap';
import '../../styles/ResumenCompra.css';

function ResumenCompra({ compra }) {
  const total = compra.items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  return (
    <>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre<span className="resumen-req">*</span></Form.Label>
            <Form.Control type="text" defaultValue={compra.nombre} readOnly />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="apellidos">
            <Form.Label>Apellidos<span className="resumen-req">*</span></Form.Label>
            <Form.Control type="text" defaultValue={compra.apellidos} readOnly />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="correo">
            <Form.Label>Correo<span className="resumen-req">*</span></Form.Label>
            <Form.Control type="email" defaultValue={compra.correo} readOnly />
          </Form.Group>
        </Col>
      </Row>

      <h2 className="resumen-subtitulo">Dirección de entrega de los productos</h2>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="calle">
            <Form.Label>Calle<span className="resumen-req">*</span></Form.Label>
            <Form.Control type="text" defaultValue={compra.calle} readOnly />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="departamento">
            <Form.Label>Departamento (opcional)</Form.Label>
            <Form.Control type="text" defaultValue={compra.departamento} readOnly />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="region">
            <Form.Label>Región<span className="resumen-req">*</span></Form.Label>
            <Form.Select defaultValue={compra.region} disabled>
              <option>{compra.region}</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="comuna">
            <Form.Label>Comuna<span className="resumen-req">*</span></Form.Label>
            <Form.Select defaultValue={compra.comuna} disabled>
              <option>{compra.comuna}</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="indicaciones">
        <Form.Label>Indicaciones para la entrega (opcional)</Form.Label>
        <Form.Control as="textarea" rows={3} defaultValue={compra.indicaciones} readOnly />
      </Form.Group>

      <Table size="sm" className="resumen-tabla">
        <thead>
          <tr>
            <th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {compra.items.map((i) => (
            <tr key={i.id}>
              <td><div className="resumen-imagen" /></td>
              <td>{i.nombre}</td>
              <td>${i.precio.toLocaleString('es-CL')}</td>
              <td>{i.cantidad}</td>
              <td>${(i.precio * i.cantidad).toLocaleString('es-CL')}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="resumen-total">
        Total pagado: ${total.toLocaleString('es-CL')}
      </div>
    </>
  );
}

export default ResumenCompra;