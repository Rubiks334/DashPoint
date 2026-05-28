import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './caja.css';

const Caja = () => {
  const [movimientos, setMovimientos] = useState([]);

  const obtenerHistorial = async () => {
    try {
      const res = await api.get("/caja/movimientos/historial");
      setMovimientos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  return (
    <div className="caja-full-wrapper">
      <div className="caja-header-full">
        <h2>📊 Historial de Caja</h2>
      </div>

      <div className="caja-body-full">
        <table className="caja-table-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Usuario</th>
              <th>Caja</th>
              <th>Estado</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => {
              let color = "black";
              if (m.tipo === "venta") color = "green";
              if (m.tipo === "ingreso") color = "blue";
              if (m.tipo === "retiro") color = "red";
              if (m.tipo === "ajuste") color = "orange";

              const estadoCaja = m.fecha_cierre ? "🔴 Cerrada" : "🟢 Abierta";

              return (
                <tr key={m.id_movimiento}>
                  <td>{new Date(m.fecha).toLocaleString()}</td>
                  <td style={{ color, fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {m.tipo}
                  </td>
                  <td className="monto-negrita">${m.monto}</td>
                  <td>{m.nombre_usuario}</td>
                  <td>#{m.id_caja}</td>
                  <td>{estadoCaja}</td>
                  <td className="texto-descripcion">{m.descripcion}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Caja;
