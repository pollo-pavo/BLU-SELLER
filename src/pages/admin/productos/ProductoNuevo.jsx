import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { adminCrearProducto, obtenerCategorias } from '../../../services/api';
import '../../../styles/admin/productos/ProductoNuevo.css';

function ProductoNuevo() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    obtenerCategorias()
      .then((datos) => setCategorias(datos))
      .catch((error) => console.error(error));
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const c = e.target.elements;

    try {
      await adminCrearProducto({
        codigo: c.codigo.value,
        nombre: c.nombre.value,
        descripcion: c.descripcion.value,
        precio: c.precio.value,
        precio_oferta: c.precioOferta.value,
        stock: c.stock.value,
        stock_critico: c.critico.value,
        categoria_id: c.categoria.value,
      });
      window.alert('Producto creado correctamente');
      navigate('/admin/productos');
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <div className="producto-nuevo">
      <h1>NUEVO PRODUCTO</h1>

      <form className="producto-form-caja" onSubmit={guardar}>
        <div className="producto-form-encabezado">Registro de producto</div>

        <label htmlFor="codigo">CÓDIGO</label>
        <input id="codigo" type="text" required minLength={3} />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" required maxLength={100} />

        <label htmlFor="descripcion">DESCRIPCIÓN</label>
        <textarea id="descripcion" rows="3" maxLength={500} />

        <label htmlFor="precio">PRECIO</label>
        <input id="precio" type="number" min="0" step="any" required />

        <label htmlFor="precioOferta">PRECIO OFERTA (OPCIONAL)</label>
        <input id="precioOferta" type="number" min="0" step="any" />

        <label htmlFor="stock">STOCK</label>
        <input id="stock" type="number" min="0" required />

        <label htmlFor="critico">STOCK CRÍTICO</label>
        <input id="critico" type="number" min="0" required />

        <label htmlFor="categoria">CATEGORÍA</label>
        <select id="categoria" defaultValue="" required>
          <option value="" disabled>-- Seleccione la categoría --</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>

        <button type="submit">GUARDAR</button>
        <Link to="/admin/productos">Volver</Link>
      </form>
    </div>
  );
}

export default ProductoNuevo;