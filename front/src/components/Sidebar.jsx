import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api"; // Tu servicio de API
import "./sidebar.css";
import iconUsuario from "../assets/icons/usuario-icon.png"

function Sidebar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await api.get("/usuarios/me");
        setUsuario(res.data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    obtenerUsuario();
  }, []);

  return (
    <div className="sidebar-container">
      {/* SECCIÓN DE PERFIL (Tu lógica de foto) */}
      <div className="sidebar-profile">
        <div className="profile-img-container">
          {usuario?.foto_url ? (
            <img
              src={`http://localhost:3000${usuario.foto_url}`}
              alt="Perfil"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-icon-placeholder"><img src="{iconUsuario}" alt="" /></div>
          )}
        </div>
        <p className="profile-name">
          {usuario?.nombre_usuario || "Cargando..."}
        </p>
      </div>

      {/* NAVEGACIÓN (Con NavLink para el color azul) */}
      <nav className="sidebar-nav">
        <NavLink to="/home" className="nav-item">🏠 Home</NavLink>
        <NavLink to="/caja" className="nav-item">🧾 Caja/mov</NavLink>
        
        {/* Tu lógica de roles: Solo admin ve estas */}
        {usuario?.rol === "admin" && (
          <NavLink to="/dashboard" className="nav-item">📊 Dashboard</NavLink>
        )}
        
        <NavLink to="/ventas" className="nav-item">🏷️ Ventas</NavLink>
        <NavLink to="/productos" className="nav-item">📦 Productos</NavLink>
        <NavLink to="/inventario" className="nav-item">📋 Inventario</NavLink>
        
        {usuario?.rol === "admin" && (
          <>
            <NavLink to="/proveedores" className="nav-item">👤 Proveedor</NavLink>
            <NavLink to="/usuarios" className="nav-item">👥 Usuarios</NavLink>
            <NavLink to="/finanzas" className="nav-item">💰 Finanzas</NavLink>
          </>
        )}
      </nav>

      {/* BOTÓN SALIR */}
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default Sidebar;