import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./Movimientos.css"

const Movimientos = () => {

  const { id } = useParams();
  const navigate = useNavigate(); 
  const [movimientos, setMovimientos] = useState([]);

  const obtener = async () => {
    try {
      const res = await api.get(`/inventario/movimientos/${id}`);
      setMovimientos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtener();
  }, []);

 return (
    <div className="movimientos-container">
      {/* Barra superior de encabezado oscuro idéntica a tus otras listas */}
      <div className="movimientos-header-main">Lista de Movimientos</div>

      <div className="movimientos-content">
        {/* Tarjeta contenedora blanca principal */}
        <div className="movimientos-card-panel">
          
          {/* Fila de controles superior (Botón regresar opcional / Decorativo) */}
          <div className="movimientos-top-actions">
            <button 
              type="button" 
              className="btn-movimientos-back"
              onClick={() => navigate("/inventario")}
            >
              ⬅ Regresar
            </button>
          </div>

          {/* Contenedor responsivo para la tabla */}
          <div className="movimientos-table-wrapper">
            <table className="movimientos-table-main">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Comentario</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.length > 0 ? (
                  movimientos.map((m) => (
                    <tr key={m.id_movimiento}>
                      {/* Badge dinámico según el tipo de movimiento */}
                      <td className="td-tipo-movimiento">
                        <span className={`badge-tipo ${m.tipo?.toLowerCase()}`}>
                          {m.tipo}
                        </span>
                      </td>
                      <td className="td-cantidad-movimiento">
                        {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                      </td>
                      <td className="td-comentario">{m.comentarios || "Sin comentarios"}</td>
                      <td className="td-usuario">{m.nombre_usuario}</td>
                      <td className="td-fecha">
                        {new Date(m.fecha_movimiento).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="movimientos-empty-state">
                      No se registran movimientos para este producto.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Icono de fondo decorativo en la esquina inferior igual al de ventas */}
          <div className="movimientos-decor-tag">
            <span className="decor-icon-sheet">📄</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Movimientos;