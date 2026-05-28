import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import finanzasImg from "../../assets/images/Finanzas-img.png"; 
import "./finanzasForm.css";

const FinanzaForm = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    tipo: "gasto",
    monto: "",
    descripcion: ""
  });

  const [loading, setLoading] = useState(false);

  const obtenerRegistro = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/finanzas/${id}`);
      setForm(res.data);

    } catch (error) {
      alert("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) obtenerRegistro();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!form.monto) {
      return alert("Monto obligatorio");
    }

    try {

      const data = {
        ...form,
        monto: Number(form.monto) // 🔥 importante
      };

      if (id) {
        await api.put(`/finanzas/${id}`, data);
        alert("Actualizado");
      } else {
        await api.post("/finanzas", data);
        alert("Creado");
      }

      navigate("/finanzas");

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  if (loading) return <p>Cargando...</p>;

 return (
    <div className="finanzas-container">
      {/* Barra superior de encabezado oscuro corporativo */}
      <div className="finanzas-header-main">
        {id ? "Modificar Registro Financiero" : "Finanzas"}
      </div>

      <div className="finanzas-content">
        {/* Tarjeta de doble columna (Formulario + Imagen) */}
        <div className="finanzas-split-card">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="finanzas-form-side">
            <h2 className="finanzas-form-title">
              {id ? "✏️ Editar" : "Registrar"} Movimiento
            </h2>

            <form onSubmit={guardar} className="finanzas-form-element">
              
              {/* SELECT DE TIPO DE MOVIMIENTO */}
              <div className="form-group-finanzas">
                <label className="label-finanzas">Tipo</label>
                <select 
                  name="tipo" 
                  value={form.tipo} 
                  onChange={handleChange}
                  className="select-finanzas-custom"
                >
                  <option value="gasto">Gasto</option>
                  <option value="inversion">Inversión</option>
                  <option value="ganancia">Ganancia</option>
                  <option value="perdida">Pérdida</option>
                </select>
              </div>

              {/* INPUT DE MONTO NUMÉRICO */}
              <div className="form-group-finanzas">
                <label className="label-finanzas">Monto</label>
                <input
                  type="number"
                  name="monto"
                  placeholder="0.00"
                  value={form.monto}
                  onChange={handleChange}
                  className="input-finanzas-text"
                />
              </div>

              {/* INPUT DE DESCRIPCIÓN */}
              <div className="form-group-finanzas">
                <label className="label-finanzas">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Ej: gasto."
                  value={form.descripcion}
                  onChange={handleChange}
                  className="input-finanzas-text"
                />
              </div>

              {/* BOTONES DE ACCIÓN INFERIORES */}
              <div className="finanzas-form-actions">
                <button type="submit" className="btn-finanzas-submit">
                  {id ? "Actualizar" : "Registrar"}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => navigate("/finanzas")}
                  className="btn-finanzas-cancel"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>

          {/* COLUMNA DERECHA: IMAGEN DE ASSETS */}
          <div className="finanzas-image-side">
            <img 
              src={finanzasImg} 
              alt="Finanzas Corporativas" 
              className="finanzas-side-photo"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinanzaForm;