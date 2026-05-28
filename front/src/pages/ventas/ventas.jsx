import api from "../../services/api.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ventas.css";
const Ventas = () => {

  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [caja, setCaja] = useState(null);

  const obtenerCaja = async () => {
    try {
      const res = await api.get("/caja/actual");
      setCaja(res.data);
    } catch {
      setCaja(null);
    }
  };

  useEffect(() => {
    obtenerCaja();
  }, []);

  const obtenerVentas = async () => {
    try {
      const res = await api.get("/ventas");
      setVentas(res.data);
    } catch (error) {
      console.log("Error al obtener ventas", error);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  /* =========================
     DETALLE
  ========================= */
  const verDetalle = (id) => {
    navigate(`/ventas/${id}`);
  };

  /* =========================
     CANCELAR
  ========================= */
  const cancelarVenta = async (id) => {

    const confirmar = window.confirm("¿Seguro que deseas cancelar esta venta?");

    if (!confirmar) return;

    try {

      await api.put(`/ventas/cancelar/${id}`);

      alert("Venta cancelada");

      obtenerVentas(); // 🔥 refrescar tabla

    } catch (error) {

      alert(error.response?.data?.error);

    }
  };

  return (
  <div className="ventas-container">
    <div className="ventas-header-main">Lista de ventas</div>
    
    <div className="ventas-content">
      <div className="ventas-actions-bar">
        {!caja ? (
          <p className="caja-status-msg">🔴 Caja cerrada</p>
        ) : (
          <button className="btn-nueva-venta" onClick={() => navigate("/crearventas")}>
            🛒 Nueva venta
          </button>
        )}
      </div>

      <table className="ventas-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Usuario</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{new Date(venta.fecha_hora).toLocaleDateString()}</td>
              <td style={{fontWeight: 'bold'}}>${venta.total}</td>
              <td className={venta.estado === "cancelada" ? "status-cancelada" : "status-completada"}>
                {venta.estado === "cancelada" ? "Cancelada" : "Terminado"}
              </td>
              <td>{venta.nombre_usuario}</td>
              <td>
                <button className="btn-detalle" onClick={() => verDetalle(venta.id_venta)}>Detalle</button>
                {usuario?.rol === "admin" && (venta.estado !== "cancelada" && (
                  <button className="btn-cancelar" onClick={() => cancelarVenta(venta.id_venta)}>Cancelar</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default Ventas;
