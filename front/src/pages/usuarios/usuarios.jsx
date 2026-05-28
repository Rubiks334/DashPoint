import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./usuarios.css"

const Usuarios = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  /* =========================
     Obtener usuarios
  ========================= */
  const obtenerUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  /* =========================
     Eliminar usuario
  ========================= */
  const eliminarUsuario = async (id) => {

    const confirmar = confirm("¿Eliminar usuario?");
    if (!confirmar) return;

    try {

      await api.put(`/usuarios/desactivar/${id}`);

      alert("Usuario eliminado");

      obtenerUsuarios();

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  /* =========================
     Filtro búsqueda
  ========================= */
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      {/* Barra superior de encabezado oscuro corporativo */}
      <div className="usuarios-header-main">Lista de Usuarios</div>

      <div className="usuarios-content">
        {/* Tarjeta panel blanca principal */}
        <div className="usuarios-card-panel">
          
          {/* Fila superior de controles distribuida (Botón e Input) */}
          <div className="usuarios-top-bar">
            <button 
              className="btn-usuarios-add" 
              onClick={() => navigate("/usuarios/nuevo")}
            >
              <span>+</span> Nuevo usuario
            </button>

            <div className="usuarios-search-box">
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="search-icon-inside">🔍</span>
            </div>
          </div>

          {/* Contenedor responsivo para la tabla */}
          <div className="usuarios-table-wrapper">
            <table className="usuarios-table-main">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr key={u.id_usuario}>
                      {/* FOTO PERFIL CIRCULAR */}
                      <td className="td-foto-avatar">
                        {u.foto_url ? (
                          <img
                            src={`http://localhost:3000${u.foto_url}`}
                            alt="foto"
                            className="usuarios-avatar-img"
                          />
                        ) : (
                          <div className="usuarios-avatar-placeholder">👤</div>
                        )}
                      </td>
                      
                      <td className="td-nombre">{u.nombre_usuario}</td>
                      <td className="td-correo">{u.correo}</td>
                      <td className="td-telefono">{u.numero_telefonico || "—"}</td>
                      
                      {/* BADGE DE ROL */}
                      <td className="td-rol">
                        <span className={`badge-rol ${u.rol?.toLowerCase()}`}>
                          {u.rol}
                        </span>
                      </td>

                      {/* BADGE DE ESTADO */}
                      <td className="td-estado">
                        <span className={`badge-estado ${u.estado?.toLowerCase()}`}>
                          {u.estado}
                        </span>
                      </td>

                      <td className="td-fecha">
                        {new Date(u.fecha_creacion).toLocaleDateString()}
                      </td>

                      {/* BOTONES DE ACCIÓN HORIZONTALES */}
                      <td className="td-acciones">
                        <div className="action-buttons-group">
                          <button
                            className="btn-action-edit"
                            onClick={() => navigate(`/usuarios/editar/${u.id_usuario}`)}
                            title="Editar"
                          >
                            ✏️ <span>EDITAR</span>
                          </button>

                          <button
                            className="btn-action-delete"
                            onClick={() => eliminarUsuario(u.id_usuario)}
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
                    <td colSpan="8" className="usuarios-empty-state">
                      No se encontraron usuarios coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Marca de agua decorativa abajo a la derecha */}
          <div className="usuarios-decor-tag">
            <span className="decor-icon-users">👥</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Usuarios;