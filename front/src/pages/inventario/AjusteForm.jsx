import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AjusteForm.css"
import inventarioImg from "../../assets/images/Inventario-img.png";

const AjusteForm = () => {

  const { id } = useParams(); // id_producto
  const navigate = useNavigate();

  const [cantidad, setCantidad] = useState("");
  const [comentarios, setComentarios] = useState("");

  const guardar = async (e) => {
    e.preventDefault();

    if (cantidad === 0) {
      return alert("La cantidad no puede ser 0");
    }

    try {
      await api.post("/inventario/ajuste", {
        id_producto: id,
        cantidad,
        comentarios
      });

      alert("Ajuste realizado");
      navigate("/inventario");

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  return (
    <div className="ajuste-inventario-container">
      {/* Barra superior de encabezado oscuro */}
      <div className="ajuste-inventario-header-main">Inventario</div>

      <div className="ajuste-inventario-content">
        {/* Estructura Split Card Dual */}
        <div className="ajuste-inventario-split-card">
          
          {/* SECCIÓN IZQUIERDA: FORMULARIO */}
          <div className="ajuste-inventario-left">
            <h2 className="ajuste-inventario-title">Ajuste de Inventario</h2>

            <form onSubmit={guardar} className="ajuste-form-wrapper">
              
              {/* Campo para ingresar Cantidad */}
              <div className="ajuste-group-field">
                <label>Cantidad (Usa - para restar)</label>
                <div className="input-stepper-simulation">
                  <input
                    type="number"
                    placeholder="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="ajuste-input-text input-quantity"
                  />
                </div>
              </div>

              {/* Campo para ingresar Comentarios */}
              <div className="ajuste-group-field">
                <label>Razón del ajuste / Comentarios</label>
                <input
                  type="text"
                  placeholder="Ej. Mermas, error de conteo, etc."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="ajuste-input-text"
                />
              </div>

              {/* Icono decorativo de Balanza/Ajuste */}
              <div className="ajuste-decor-icon-container">
                <div className="ajuste-scale-icon">⚖️</div>
              </div>

              {/* CONTROLES INFERIORES */}
              <div className="ajuste-buttons-row">
                <button type="submit" className="btn-ajuste-submit">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/inventario")}
                  className="btn-ajuste-cancel"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>

          {/* SECCIÓN DERECHA: ASSET VISUAL COMPARTIDO */}
          <div className="ajuste-inventario-right">
            <img 
              src={inventarioImg} 
              alt="Balance de Inventario" 
              className="ajuste-right-display-img" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AjusteForm;