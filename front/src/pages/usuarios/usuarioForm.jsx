import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import usuariosImg from "../../assets/images/Usuarios-img.png"; 
import "./usuarioForm.css";

const UsuarioForm = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    password: "",
    numero_telefonico: "",
    rol: "vendedor",
    estado: "activo"
  });

  const [foto, setFoto] = useState(null); // 🔥 archivo real
  const [preview, setPreview] = useState(null); // 🔥 preview

  const [loading, setLoading] = useState(false);

  /* =========================
     Cargar usuario (editar)
  ========================= */
  const obtenerUsuario = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/usuarios/${id}`);
      const data = res.data;

      setForm({
        nombre_usuario: data.nombre_usuario || "",
        correo: data.correo || "",
        password: "",
        numero_telefonico: data.numero_telefonico || "",
        rol: data.rol || "vendedor",
        estado: data.estado || "activo"
      });

      // 🔥 mostrar imagen actual
      if (data.foto_url) {
        setPreview(`http://localhost:3000${data.foto_url}`);
      }

    } catch (error) {
      console.error(error);
      alert("Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      obtenerUsuario();
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
     Manejar imagen
  ========================= */
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoto(file);

    // preview local
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  /* =========================
     Guardar
  ========================= */
  const guardar = async (e) => {

    e.preventDefault();

    if (!form.nombre_usuario || !form.correo) {
      return alert("Nombre y correo son obligatorios");
    }

    try {

      // 🔥 usar FormData SIEMPRE
      const formData = new FormData();

      formData.append("nombre_usuario", form.nombre_usuario);
      formData.append("correo", form.correo);
      formData.append("rol", form.rol);
      formData.append("estado", form.estado);
      formData.append("numero_telefonico", form.numero_telefonico);

      if (form.password) {
        formData.append("password", form.password);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      if (id) {
        await api.put(`/usuarios/${id}`, formData);
        alert("Usuario actualizado");
      } else {
        if (!form.password) {
          return alert("La contraseña es obligatoria");
        }

        await api.post("/usuarios", formData);
        alert("Usuario creado");
      }

      navigate("/usuarios");

    } catch (error) {
      alert(error.response?.data?.error);
    }
  };

  if (loading) return <p>Cargando usuario...</p>;

 return (
    <div className="form-usuario-container">
      {/* Barra superior de encabezado oscuro corporativo */}
      <div className="form-usuario-header-main">Usuarios</div>

      <div className="form-usuario-content">

        {/* Contenedor de la tarjeta split */}
        <div className="form-usuario-card">
          
          {/* SECCIÓN IZQUIERDA: Formulario */}
          <div className="form-usuario-left">
            <h2 className="form-card-subtitle">
              {id ? "Modificar datos de usuario" : "Registrar nuevo usuario"}
            </h2>

            <form onSubmit={guardar} className="form-grid-layout">
              
              {/* Bloque superior de carga de Avatar */}
              <div className="form-avatar-upload-section">
                <div className="avatar-preview-wrapper">
                  {preview ? (
                    <img src={preview} alt="preview" className="avatar-preview-img" />
                  ) : (
                    <div className="avatar-preview-placeholder">👤</div>
                  )}
                </div>
                <div className="avatar-input-wrapper">
                  <label htmlFor="avatar-file-input" className="btn-upload-file-label">
                    📸 Seleccionar Foto
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    className="hidden-file-input"
                  />
                  <span className="file-hint-text">Formatos sugeridos: JPG, PNG</span>
                </div>
              </div>

              {/* Fila: Nombre y Teléfono */}
              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Nombre de usuario</label>
                  <input
                    type="text"
                    name="nombre_usuario"
                    placeholder="Ingresa nombre"
                    value={form.nombre_usuario}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-wrapper">
                  <label>Número de teléfono</label>
                  <input
                    type="text"
                    name="numero_telefonico"
                    placeholder="Ingresa teléfono"
                    value={form.numero_telefonico}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Fila: Correo y Contraseña */}
              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    placeholder="Ingresa correo"
                    value={form.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-field-wrapper">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={id ? "Nueva contraseña (opcional)" : "Ingresa contraseña"}
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Fila: Selección de Rol */}
              <div className="form-group-row">
                <div className="input-field-wrapper">
                  <label>Rol de usuario</label>
                  <select
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    className="select-field-custom"
                  >
                    <option value="admin">Admin</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>
                {/* Espacio vacío para mantener simetría si no se usa estado */}
                <div className="input-field-wrapper static-blank-space"></div>
              </div>

              {/* Grupo de botones de acción */}
              <div className="form-actions-wrapper">
                <button type="submit" className="btn-form-submit">
                  {id ? "Actualizar" : "Registrar"}
                </button>
                
                <button
                  type="button"
                  className="btn-form-cancel"
                  onClick={() => navigate("/usuarios")}
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>

          {/* SECCIÓN DERECHA: Imagen corporativa */}
          <div className="form-usuario-right">
            <img 
              src={usuariosImg} 
              alt="Gestión de Usuarios" 
              className="form-side-img" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;