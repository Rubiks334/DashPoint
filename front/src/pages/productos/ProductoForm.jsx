import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductoForms.css";
import carritoImg from "../../assets/images/Productos-img.png";

const ProductoForm = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nombre_producto: "",
    precio_compra: "",
    precio_venta: "",
    id_proveedor: ""
  });

  const [proveedores, setProveedores] = useState([]);

  /* =========================
     Obtener proveedores
  ========================= */
  const obtenerProveedores = async () => {
    try {
      const res = await api.get("/proveedores");
      setProveedores(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     Obtener producto (editar)
  ========================= */
  const obtenerProducto = async () => {
    try {
      const res = await api.get(`/productos/${id}`);
      setForm(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar producto");
    }
  };

  useEffect(() => {
    obtenerProveedores();

    if (id) {
      obtenerProducto();
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
     Guardar
  ========================= */
  const guardar = async (e) => {
    e.preventDefault();

    if (
      !form.nombre_producto ||
      !form.precio_compra ||
      !form.precio_venta ||
      !form.id_proveedor
    ) {
      return alert("Todos los campos son obligatorios");
    }

    try {

      if (id) {
        await api.put(`/productos/${id}`, form);
        alert("Producto actualizado");
      } else {
        await api.post("/productos", form);
        alert("Producto creado");
      }

      navigate("/productos");

    } catch (error) {
      alert(error.response?.data?.mensaje || "Error");
    }
  };

  return (
    <div className="form-producto-container">
      {/* Header oscuro superior que cambia el texto de forma dinámica */}
      <div className="form-producto-header-main">
        {id ? "Editar Producto" : "Agregar Producto"}
      </div>

      <div className="form-producto-content">
        {/* Tarjeta dividida (Split Card) */}
        <div className="form-producto-split-card">
          
          {/* LADO IZQUIERDO: FORMULARIO */}
          <div className="form-producto-left">
            <h2 className="form-producto-subtitle">
              {id ? "Modifica los datos del producto" : "Agrega los datos del producto"}
            </h2>

            <form onSubmit={guardar} className="form-element-wrapper">
              
              <div className="form-group-field">
                <label>Nombre del producto</label>
                <input
                  type="text"
                  name="nombre_producto"
                  placeholder="Ingresa nombre"
                  value={form.nombre_producto}
                  onChange={handleChange}
                  className="form-input-text"
                />
              </div>

              <div className="form-group-field">
                <label>Precio de compra</label>
                <input
                  type="number"
                  name="precio_compra"
                  placeholder="0.00"
                  step="0.01"
                  value={form.precio_compra}
                  onChange={handleChange}
                  className="form-input-text"
                />
              </div>

              <div className="form-group-field">
                <label>Precio de venta</label>
                <input
                  type="number"
                  name="precio_venta"
                  placeholder="0.00"
                  step="0.01"
                  value={form.precio_venta}
                  onChange={handleChange}
                  className="form-input-text"
                />
              </div>

              <div className="form-group-field">
                <label>Proveedor</label>
                <select
                  name="id_proveedor"
                  value={form.id_proveedor}
                  onChange={handleChange}
                  className="form-select-custom"
                >
                  <option value="">Seleccione proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id_proveedor} value={prov.id_proveedor}>
                      {prov.nombre_empresa}
                    </option>
                  ))}
                </select>
              </div>

              {/* BOTONES DE ACCIÓN INFERIORES */}
              <div className="form-buttons-row">
                <button type="submit" className="btn-form-submit">
                  {id ? "Actualizar" : "Registrar"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/productos")}
                  className="btn-form-cancel"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>

          {/* LADO DERECHO: IMAGEN DEL CARRITO */}
          <div className="form-producto-right">
            <img 
              src={carritoImg} 
              alt="Productos e-commerce" 
              className="form-right-display-img" 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductoForm;