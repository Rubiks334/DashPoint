import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import proveedoresImg from "../../assets/images/Proveedores-img.png"; 
import "./proveedorForm.css";

const ProveedorForm = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nombre_empresa: "",
    nombre_contacto: "",
    correo: "",
    numero_telefonico: "",
    direccion: ""
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     Cargar proveedor (editar)
  ========================= */
const obtenerProveedor = async () => {
  try {

    setLoading(true);

    const res = await api.get(`/proveedores/${id}`);

    console.log("DATA:", res.data);

    const data = res.data.proveedor || res.data;

    setForm({
      nombre_empresa: data.nombre_empresa || "",
      nombre_contacto: data.nombre_contacto || "",
      correo: data.correo || "",
      numero_telefonico: data.numero_telefonico || "",
      direccion: data.direccion || ""
    });

  } catch (error) {
    console.error(error);
    alert("Error al cargar proveedor");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (id) {
      obtenerProveedor();
    }
  }, [id]);

  /* =========================
     Manejar cambios
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* =========================
     Guardar (crear o editar)
  ========================= */
  const guardar = async (e) => {

    e.preventDefault();

    if (!form.nombre_empresa) {
      return alert("Nombre de empresa obligatorio");
    }

    try {

      if (id) {
        await api.put(`/proveedores/${id}`, form);
        alert("Proveedor actualizado");
      } else {
        await api.post("/proveedores", form);
        alert("Proveedor creado");
      }

      navigate("/proveedores");

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) return <p>Cargando proveedor...</p>;

 return (
    <div className="form-proveedor-container">
      {/* Novedad: Barra superior oscura corporativa igual a la lista */}
      <div className="form-proveedor-header-main">Proveedor</div>

      <div className="form-proveedor-content">

        {/* Contenedor de la tarjeta dividida */}
        <div className="form-proveedor-card">
          
          {/* SECCIÓN IZQUIERDA: Formulario */}
          <div className="form-proveedor-left">
            <h2 className="form-card-subtitle">
              {id ? "Modifica los datos del proveedor" : "Registrar nuevo proveedor"}
            </h2>

            <form onSubmit={guardar} className="form-grid-layout">
              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Nombre de la empresa</label>
                  <input
                    type="text"
                    name="nombre_empresa"
                    placeholder="Ingresa nombre"
                    value={form.nombre_empresa}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-wrapper">
                  <label>Nombre del contacto</label>
                  <input
                    type="text"
                    name="nombre_contacto"
                    placeholder="Ingresa nombre"
                    value={form.nombre_contacto}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="Ingresa correo"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-wrapper">
                  <label>Número telefónico</label>
                  <input
                    type="text"
                    name="numero_telefonico"
                    placeholder="Ingresa teléfono"
                    value={form.numero_telefonico}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-field-wrapper full-width-input">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Ingresa dirección"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              {/* Icono decorativo de casco */}
              <div className="form-center-decor">
                <span className="decor-icon-builder">👷‍♂️</span>
              </div>

              {/* Botones de acción */}
              <div className="form-actions-wrapper">
                <button type="submit" className="btn-form-submit">
                  {id ? "Actualizar" : "Registrar"}
                </button>
                
                <button
                  type="button"
                  className="btn-form-cancel"
                  onClick={() => navigate("/proveedores")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* SECCIÓN DERECHA: Imagen del Almacén */}
          <div className="form-proveedor-right">
            <img 
              src={proveedoresImg} 
              alt="Almacén de Proveedores" 
              className="form-side-img" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProveedorForm;