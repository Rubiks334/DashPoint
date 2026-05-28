  import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./home.css";
import homeImg from "../../assets/images/Home-img.png";

const Home = () => {
  const navigate = useNavigate();
  const [caja, setCaja] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [fondoInicial, setFondoInicial] = useState("");
  const [fondoFinal, setFondoFinal] = useState("");
  const [tipo, setTipo] = useState("retiro");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const obtenerCaja = async () => {
    try {
      const res = await api.get("/caja/actual");
      setCaja(res.data);
    } catch { setCaja(null); }
  };

  const obtenerMovimientos = async () => {
    try {
      const res = await api.get("/caja/movimientos");
      setMovimientos(Array.isArray(res.data) ? res.data : []);
    } catch { setMovimientos([]); }
  };

  useEffect(() => {
    obtenerCaja();
    obtenerMovimientos();
  }, []);

  const abrirCaja = async () => {
    if (fondoInicial === "" || Number(fondoInicial) < 0) return alert("Monto inválido");
    try {
      await api.post("/caja/abrir", { fondo_inicial: Number(fondoInicial) });
      setFondoInicial("");
      obtenerCaja();
    } catch (error) { alert(error.response?.data?.error); }
  };

  const cerrarCaja = async () => {
    if (fondoFinal === "" || Number(fondoFinal) < 0) return alert("Monto inválido");
    try {
      await api.post("/caja/cerrar", { fondo_final: Number(fondoFinal) });
      setFondoFinal("");
      obtenerCaja();
    } catch (error) { alert(error.response?.data?.error); }
  };

  const crearMovimiento = async () => {
    if (!monto || Number(monto) < 0) return alert("Monto inválido");
    try {
      await api.post("/caja/movimiento", { tipo, monto: Number(monto), descripcion });
      setMonto(""); setDescripcion("");
      obtenerMovimientos();
    } catch (error) { alert(error.response?.data?.error); }
  };

  return (
    <>
    <header className="home-header">
        <h1 className="titulo-home">Home</h1>
      </header>
    <div className="home-screen">
      

      <div className="home-content">
        <div className="caja-card">
          {/* SECCIÓN IZQUIERDA: FORMULARIOS */}
          <div className="caja-form-side">
            <h2 className="caja-title-text">C A J A</h2>
            
            {!caja ? (
              <div className="caja-closed-view">
                <div className="status-banner banner-red">Caja cerrada</div>
                <div className="form-centered">
                  <p>Ingresa el fondo inicial</p>
                  <input 
                    type="number" min="0" placeholder="0.00" 
                    value={fondoInicial} onChange={(e) => setFondoInicial(e.target.value)} 
                    className="input-big"
                  />
                  <button className="btn-pill btn-dark-green" onClick={abrirCaja}>
                    Abrir caja ➤
                  </button>
                </div>
              </div>
            ) : (
              <div className="caja-open-view">
                <div className="status-banner banner-green">Caja abierta</div>
                <p className="initial-fund-label">Fondo inicial: <span>${caja.fondo_inicial}.00</span></p>

                <hr className="caja-divider" />

                <div className="movement-registration">
                  <h3>Registrar movimiento</h3>
                  <div className="movement-grid">
                    <div className="field">
                      <label>Seleccionar</label>
                      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="retiro">Retiro</option>
                        <option value="ingreso">Ingreso</option>
                        <option value="ajuste">Ajuste</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Monto</label>
                      <input type="number" min="0" placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Descripcion</label>
                      <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-pill btn-dark-green btn-reg" onClick={crearMovimiento}>Registrar</button>
                </div>

                <hr className="caja-divider" />

                <div className="movements-table-container">
                  <h3>Movimientos</h3>
                  <div className="scroll-table">
                    <table className="energy-table">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Monto</th>
                          <th>Descripción</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientos.map((m) => (
                          <tr key={m.id_movimiento}>
                            <td className={`type-${m.tipo}`}>{m.tipo}</td>
                            <td>{Number(m.monto).toFixed(2)}</td>
                            <td>{m.descripcion}</td>
                            <td>{new Date(m.fecha).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="caja-footer">
                  <input type="number" min="0" placeholder="0.00" value={fondoFinal} onChange={(e) => setFondoFinal(e.target.value)} />
                  <button className="btn-pill btn-red" onClick={cerrarCaja}>Cerrar caja →</button>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN DERECHA: IMAGEN */}
          <div className="caja-image-side">
            {caja && (
              <button className="btn-overlay-venta" onClick={() => navigate("/crearventas")}>
                🛒 Nueva venta
              </button>
            )}
            <img src={homeImg} alt="Workspace" className="side-img" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;