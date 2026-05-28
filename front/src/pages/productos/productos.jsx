import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./productos.css"

const Productos = () => {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  /* =========================
     Obtener productos
  ========================= */
  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* =========================
     Eliminar producto
  ========================= */
const eliminarProducto = async (id) => {

  const confirmar = window.confirm("¿Eliminar producto?");
  if (!confirmar) return;

  try {

    await api.delete(`/productos/${id}`);

    setProductos(productos.filter(p => p.id_producto !== id));

  } catch (error) {
    alert(error.response?.data?.mensaje || "Error al eliminar");
  }
};
  /* =========================
     Filtro búsqueda
  ========================= */
  const productosFiltrados = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      {/* Header oscuro superior idéntico al mockup */}
      <div className="productos-header-main">Lista de Productos</div>

      <div className="productos-content">
        {/* Barra superior de acciones alineada */}
        <div className="productos-actions-bar">
          <button 
            className="btn-agregar-producto" 
            onClick={() => navigate("/productos/nuevo")}
          >
            <span className="btn-icon">＋</span> Agregar producto
          </button>

          <div className="productos-search-wrapper">
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              className="productos-search-input"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla estilizada */}
        <table className="productos-table">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Precio de Compra</th>
              <th>Precio de Venta</th>
              <th>Proveedor</th>
              <th style={{ textAlign: "center" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id_producto}>
                <td className="prod-name-cell">{p.nombre_producto}</td>
                <td>{Number(p.precio_compra).toFixed(2)}</td>
                <td>{Number(p.precio_venta).toFixed(2)}</td>
                <td>{p.nombre_empresa || "Sin proveedor"}</td>

                <td>
                  <div className="prod-action-buttons">
                    <button
                      className="btn-action-editar"
                      title="Editar"
                      onClick={() => navigate(`/productos/editar/${p.id_producto}`)}
                    >
                      ✏️ <span className="action-text">Editar</span>
                    </button>

                    <button
                      className="btn-action-eliminar"
                      title="Eliminar"
                      onClick={() => eliminarProducto(p.id_producto)}
                    >
                      🗑 <span className="action-text">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-products-text">
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;