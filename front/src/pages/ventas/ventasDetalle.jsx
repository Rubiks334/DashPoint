import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ventasDetalle.css";


const VentaDetalle = () => {

    const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState(null);
  const [detalle, setDetalle] = useState([]);

  const obtenerDetalle = async () => {
    try {

      const res = await api.get(`/ventas/detalles/${id}`);

      setVenta(res.data.venta);
      setDetalle(res.data.detalle);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerDetalle();
  }, []);

  if (!venta) return <p>Cargando...</p>;

  return (
    <div className="detalle-venta-container">
      {/* HEADER DE LA SECCIÓN */}
      <div className="detalle-venta-header">
        Detalle de venta #{venta.id_venta}
      </div>

      <div className="detalle-venta-content">
        
        {/* TABLA PRINCIPAL DE LOS ARTÍCULOS VENDIDOS */}
        <div className="detalle-table-card">
          <table className="detalle-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {detalle.map((item) => (
                <tr key={item.id_detalle}>
                  <td className="detail-product-name">{item.nombre_producto}</td>
                  <td style={{ textAlign: "center" }} className="detail-quantity">
                    {item.cantidad}
                  </td>
                  <td>${Number(item.precio_unitario).toFixed(2)}</td>
                  <td className="detail-subtotal">${Number(item.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CONTENEDOR INFERIOR: ACCIÓN Y TOTALES */}
        <div className="detalle-footer">
          <button className="btn-regresar-detalle" onClick={() => navigate("/ventas")}>
            ← Regresar
          </button>

          <div className="detalle-total-box">
            <span className="detalle-total-label">Total</span>
            <span className="detalle-total-amount">${Number(venta.total).toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VentaDetalle;