import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./proveedores.css"

const Proveedores = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);

  /* =========================
     Obtener proveedores
  ========================= */
  const obtenerProveedores = async () => {
    try {

      const res = await api.get("/proveedores");
      setProveedores(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  /* =========================
     Eliminar proveedor
  ========================= */
  const eliminarProveedor = async (id) => {

    const confirmar = window.confirm("¿Eliminar proveedor?");

    if (!confirmar) return;

    try {

      await api.delete(`/proveedores/${id}`);

      alert("Proveedor eliminado");

      obtenerProveedores(); // 🔥 refrescar

    } catch (error) {

      alert(error.response?.data?.error);

    }
  };

  /* =========================
     Editar proveedor
  ========================= */
  const editarProveedor = (proveedor) => {

    // 🔥 aquí luego puedes abrir modal o navegar
    console.log("Editar:", proveedor);

  };

  return (
    <div className="proveedores-container">
      {/* Barra superior de encabezado oscuro corporativo */}
      <div className="proveedores-header-main">Lista de Proveedores</div>

      <div className="proveedores-content">
        {/* Tarjeta contenedora blanca principal */}
        <div className="proveedores-card-panel">
          
          {/* Fila superior con controles y botón de agregar */}
          <div className="proveedores-top-actions">
            <button 
              className="btn-proveedores-add"
              onClick={() => navigate("/proveedores/nuevo")}
            >
              <span>+</span> Agregar proveedor
            </button>
          </div>

          {/* Contenedor responsivo para la tabla */}
          <div className="proveedores-table-wrapper">
            <table className="proveedores-table-main">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {proveedores.length > 0 ? (
                  proveedores.map((p) => (
                    <tr key={p.id_proveedor}>
                      <td className="td-empresa">{p.nombre_empresa}</td>
                      <td className="td-contacto">{p.nombre_contacto}</td>
                      <td className="td-correo">{p.correo}</td>
                      <td className="td-telefono">{p.numero_telefonico}</td>
                      <td className="td-direccion">{p.direccion}</td>
                      <td className="td-acciones">
                        <div className="action-buttons-group">
                          <button 
                            className="btn-action-edit"
                            onClick={() => navigate(`/proveedores/editar/${p.id_proveedor}`)}
                            title="Editar"
                          >
                            ✏️ <span>Editar</span>
                          </button>
                          
                          <button 
                            className="btn-action-delete"
                            onClick={() => eliminarProveedor(p.id_proveedor)}
                            title="Eliminar"
                          >
                            🗑 <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="proveedores-empty-state">
                      No hay proveedores registrados en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Marca de agua / Icono decorativo en la esquina inferior */}
          <div className="proveedores-decor-tag">
            <span className="decor-icon-box">📦</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Proveedores;