import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./inventario.css"

const Inventario = () => {

  const [inventario, setInventario] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     Obtener inventario
  ========================= */
  const obtenerInventario = async () => {
    try {
      setLoading(true);

      const res = await api.get("/inventario"); // 🔥 ahora sí coincide con el backend corregido

      setInventario(res.data);

    } catch (error) {
      console.error("Error inventario:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  /* =========================
     Filtro búsqueda
  ========================= */
  const filtrado = inventario.filter((p) =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <div className="inventario-container">
      {/* Header oscuro superior idéntico al mockup */}
      <div className="inventario-header-main">Inventario</div>

      <div className="inventario-content">
        {/* Barra superior de búsqueda alineada a la derecha */}
        <div className="inventario-actions-bar">
          <div className="inventario-search-wrapper">
            <span className="search-icon-inside">🔍</span>
            <input
              type="text"
              className="inventario-search-input"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla estilizada */}
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Nombre de producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style={{ textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrado.length > 0 ? (
              filtrado.map((p) => (
                <tr key={p.id_producto}>
                  <td className="inv-name-cell">{p.nombre_producto}</td>
                  <td>${Number(p.precio_venta).toFixed(2)}</td>
                  <td className="inv-stock-cell">{p.stock}</td>

                  <td>
                    <div className="inv-action-buttons">
                      <button
                        className="btn-inv-action"
                        onClick={() => navigate(`/inventario/entrada/${p.id_producto}`)}
                      >
                        Entrada
                      </button>

                      <button
                        className="btn-inv-action"
                        onClick={() => navigate(`/inventario/ajuste/${p.id_producto}`)}
                      >
                        Ajuste
                      </button>

                      <button
                        className="btn-inv-action"
                        onClick={() => navigate(`/inventario/movimientos/${p.id_producto}`)}
                      >
                        Mov
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-inventario-text">
                  No se encontraron productos en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventario;