import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminObtenerProducto, adminActualizarProducto, obtenerCategorias } from '../../../services/api';
import '../../../styles/admin/productos/ProductoEditar.css';

function ProductoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    adminObtenerProducto(id)
      .then((datos) => setProducto(datos))
      .catch((err) => setError(err.message));

    obtenerCategorias()
      .then((datos) => setCategorias(datos))
      .catch((err) => console.error(err));
  }, [id]);

  const guardar = async (e) => {
    e.preventDefault();
    const c = e.target.elements;

    try {
      await adminActualizarProducto(id, {
        codigo: c.codigo.value,
        nombre: c.nombre.value,
        descripcion: c.descripcion.value,
        precio: c.precio.value,
        precio_oferta: c.precioOferta.value,
        stock: c.stock.value,
        stock_critico: c.critico.value,
        categoria_id: c.categoria.value,
      });
      window.alert('Producto actualizado correctamente');
      navigate('/admin/productos');
    } catch (err) {
      window.alert(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!producto || categorias.length === 0) return <p>Cargando...</p>;

  return (
    <div className="producto-editar">
      <h1>EDITAR PRODUCTO</h1>

      <form className="producto-editar-caja" onSubmit={guardar}>
        <div className="producto-editar-encabezado">Editar producto {producto.codigo}</div>

        <label htmlFor="codigo">CÓDIGO</label>
        <input id="codigo" type="text" defaultValue={producto.codigo} readOnly />

        <label htmlFor="nombre">NOMBRE</label>
        <input id="nombre" type="text" defaultValue={producto.nombre} required maxLength={100} />

        <label htmlFor="descripcion">DESCRIPCIÓN</label>
        <textarea id="descripcion" rows="3" defaultValue={producto.descripcion ?? ''} maxLength={500} />

        <label htmlFor="precio">PRECIO</label>
        <input id="precio" type="number" min="0" step="any" defaultValue={producto.precio} required />

        <label htmlFor="precioOferta">PRECIO OFERTA (OPCIONAL)</label>
        <input id="precioOferta" type="number" min="0" step="any" defaultValue={producto.precio_oferta ?? ''} />

        <label htmlFor="stock">STOCK</label>
        <input id="stock" type="number" min="0" defaultValue={producto.stock} required />

        <label htmlFor="critico">STOCK CRÍTICO</label>
        <input id="critico" type="number" min="0" defaultValue={producto.stock_critico} required />

        <label htmlFor="categoria">CATEGORÍA</label>
        <select id="categoria" defaultValue={producto.categoria_id ?? ''} required>
          <option value="" disabled>-- Seleccione la categoría --</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>

        <button type="submit">ACTUALIZAR</button>
      </form>
    </div>
  );
}

export default ProductoEditar;