import { useState } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./EntradaInventario.css"
import inventarioImg from "../../assets/images/Inventario-img.png"

const EntradaInventario = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [cantidad, setCantidad] = useState("");
  const [comentarios, setComentarios] = useState("");

  const guardar = async (e) => {
    e.preventDefault();

    if (!cantidad || cantidad <= 0) {
      return alert("Cantidad inválida");
    }

    try {
      await api.post("/inventario/entrada", {
        id_producto: id,
        cantidad,
        comentarios
      });

      alert("Entrada registrada");
      navigate("/inventario");

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

 return (
    <div className="entrada-inventario-container">
      {/* Barra superior de encabezado oscuro */}
      <div className="entrada-inventario-header-main">Inventario</div>

      <div className="entrada-inventario-content">
        {/* Estructura Split Card Dual */}
        <div className="entrada-inventario-split-card">
          
          {/* SECCIÓN IZQUIERDA: FORMULARIO */}
          <div className="entrada-inventario-left">
            <h2 className="entrada-inventario-title">Agregar Inventario</h2>

            <form onSubmit={guardar} className="entrada-form-wrapper">
              
              {/* Campo para ingresar Cantidad */}
              <div className="entrada-group-field">
                <label>Cantidad</label>
                <div className="input-stepper-simulation">
                  <input
                    type="number"
                    placeholder="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="entrada-input-text input-quantity"
                  />
                </div>
              </div>

              {/* Campo para ingresar Comentarios */}
              <div className="entrada-group-field">
                <label>Comentarios / Nota</label>
                <input
                  type="text"
                  placeholder="Ingresa una descripción o motivo"
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="entrada-input-text"
                />
              </div>

              {/* Icono decorativo de la lista de verificación (Clipboard) */}
              <div className="entrada-decor-icon-container">
                <div className="entrada-clipboard-icon">📋</div>
              </div>

              {/* CONTROLES INFERIORES */}
              <div className="entrada-buttons-row">
                <button type="submit" className="btn-entrada-submit">
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/inventario")}
                  className="btn-entrada-cancel"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>

          {/* SECCIÓN DERECHA: TU IMAGEN LOCAL */}
          <div className="entrada-inventario-right">
            <img 
              src={inventarioImg} 
              alt="Inventario Almacén" 
              className="entrada-right-display-img" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EntradaInventario;