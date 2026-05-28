import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./finanzas.css"

const Finanzas = () => {

  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate();

  const obtenerRegistros = async () => {
    try {
      const res = await api.get("/finanzas");
      setRegistros(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar registro?")) return;

    try {
      await api.delete(`/finanzas/${id}`);
      obtenerRegistros();
    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  return (
    <div className="finanzas-container">
      {/* Barra superior de encabezado oscuro corporativo */}
      <div className="finanzas-header-main">Finanzas</div>

      <div className="finanzas-content">
        {/* Tarjeta panel blanca principal */}
        <div className="finanzas-card-panel">
          
          {/* Fila superior con el botón de agregar movimiento */}
          <div className="finanzas-top-actions">
            <button 
              className="btn-finanzas-add"
              onClick={() => navigate("/finanzas/nuevo")}
            >
              <span>+</span> Nuevo movimiento
            </button>
          </div>

          {/* Contenedor responsivo para la tabla */}
          <div className="finanzas-table-wrapper">
            <table className="finanzas-table-main">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {registros.length > 0 ? (
                  registros.map((r) => (
                    <tr key={r.id_finanza}>
                      {/* BADGE DE TIPO DE MOVIMIENTO (Ingreso / Egreso) */}
                      <td className="td-tipo">
                        <span className={`badge-transaccion ${r.tipo?.toLowerCase()}`}>
                          {r.tipo}
                        </span>
                      </td>

                      {/* MONTO MONETARIO */}
                      <td className={`td-monto monto-${r.tipo?.toLowerCase()}`}>
                        ${r.monto}
                      </td>

                      <td className="td-descripcion">{r.descripcion || "—"}</td>
                      
                      <td className="td-fecha">
                        {new Date(r.fecha).toLocaleDateString()}
                      </td>

                      {/* ACCIONES DE EDICIÓN / ELIMINACIÓN HORIZONTALES */}
                      <td className="td-acciones">
                        <div className="action-buttons-group">
                          <button 
                            className="btn-action-edit"
                            onClick={() => navigate(`/finanzas/editar/${r.id_finanza}`)}
                            title="Editar"
                          >
                            ✏️ <span>EDITAR</span>
                          </button>
                          
                          <button 
                            className="btn-action-delete"
                            onClick={() => eliminar(r.id_finanza)}
                            title="Eliminar"
                          >
                            🗑 <span>ELIMINAR</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="finanzas-empty-state">
                      No hay registros financieros documentados en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Marca de agua / Icono decorativo financiero en la esquina inferior derecha */}
          <div className="finanzas-decor-tag">
            <span className="decor-icon-cash">💵</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Finanzas;