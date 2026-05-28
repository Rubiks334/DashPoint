import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./CrearVenta.css";

const CrearVenta = () => {

    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [carrito, setCarrito] = useState([]);

    /* =========================
       Obtener productos
    ========================= */
    const obtenerProductos = async () => {
        const res = await api.get("/productos");
        setProductos(res.data);
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    /* =========================
       Agregar al carrito
    ========================= */
    const agregarProducto = (producto) => {

        const existe = carrito.find(p => p.id_producto === producto.id_producto);

        if (existe) {
            setCarrito(carrito.map(p =>
                p.id_producto === producto.id_producto
                    ? { ...p, cantidad: p.cantidad + 1 }
                    : p
            ));
        } else {
            setCarrito([
                ...carrito,
                {
                    id_producto: producto.id_producto,
                    nombre: producto.nombre_producto,
                    precio: producto.precio_venta,
                    cantidad: 1
                }
            ]);
        }
    };

    /* =========================
       Cambiar cantidad
    ========================= */
    const cambiarCantidad = (id, cantidad) => {
        setCarrito(carrito.map(p =>
            p.id_producto === id
                ? { ...p, cantidad: Number(cantidad) }
                : p
        ));
    };

    /* =========================
       Eliminar producto
    ========================= */
    const eliminarProducto = (id) => {
        setCarrito(carrito.filter(p => p.id_producto !== id));
    };

    /* =========================
       Total
    ========================= */
    const total = carrito.reduce(
        (acc, p) => acc + (p.precio * p.cantidad),
        0
    );

    /* =========================
       Crear venta
    ========================= */
    const crearVenta = async () => {

        if (carrito.length === 0) {
            return alert("Agrega productos");
        }

        try {

            await api.post("/ventas", {
                productos: carrito.map(p => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad
                }))
            });

            alert("Venta realizada");

            setCarrito([]);

        } catch (error) {
            alert(error.response?.data?.error);
        }
    };

    /* =========================
       Filtro productos
    ========================= */
    const productosFiltrados = productos.filter(p =>
        p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
    );

    const cancelar = () => {
        const confirmar = window.confirm("¿Seguro que deseas cancelar esta venta?");
        if (!confirmar) return;
        navigate("/home");

    }

   return (
        <div className="crear-venta-container">
            <div className="crear-venta-content">
                
                {/* SECCIÓN SUPERIOR: BUSCADOR DE PRODUCTOS */}
                <div className="search-section">
                    <div className="search-bar-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar producto"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* TARJETA DE PRODUCTOS DISPONIBLES */}
                <div className="products-card">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th style={{ textAlign: "center" }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map(p => (
                                <tr key={p.id_producto}>
                                    <td className="product-name">{p.nombre_producto}</td>
                                    <td className="product-price">${Number(p.precio_venta).toFixed(2)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="btn-add-product" onClick={() => agregarProducto(p)}>
                                            +
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* SECCIÓN SEPARADORA: CARRITO TITULO */}
                <div className="carrito-header-title">
                    <span className="cart-title-icon">🛒</span>
                    <h2>CARRITO</h2>
                </div>

                {/* TARJETA DEL CARRITO DE COMPRAS */}
                <div className="cart-card">
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio unit</th>
                                <th>Subtotal</th>
                                <th style={{ textAlign: "center" }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map(p => (
                                <tr key={p.id_producto}>
                                    <td className="product-name">{p.nombre}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="cart-quantity-input"
                                            min="1"
                                            value={p.cantidad}
                                            onChange={(e) =>
                                                cambiarCantidad(p.id_producto, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>${Number(p.precio).toFixed(2)}</td>
                                    <td className="subtotal-cell">${Number(p.precio * p.cantidad).toFixed(2)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button className="btn-remove-product" onClick={() => eliminarProducto(p.id_producto)}>
                                            −
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {carrito.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-cart-text">
                                        El carrito está vacío. Agrega productos arriba.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER DE ACCIONES: BOTONES Y TOTAL */}
                <div className="cart-footer">
                    <div className="action-buttons">
                        <button className="btn-confirmar-venta" onClick={crearVenta}>
                            Realizar venta
                        </button>
                        <button className="btn-cancelar-venta" onClick={() => cancelar()}>
                            Cancelar venta
                        </button>
                    </div>

                    <div className="total-display-box">
                        <span className="total-label">Total</span>
                        <span className="total-amount">${Number(total).toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CrearVenta;