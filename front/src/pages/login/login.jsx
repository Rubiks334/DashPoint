import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import './login.css';
import fondo from '../../assets/images/Background-Login.png';
import barraIcon from "../../assets/icons/barra-icons.png"

function Login() {

  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post("/auth/login", {
        correo,
        password
      });
      

      // guardar token
      localStorage.setItem("token", res.data.token);

      // guardar usuario
    localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      
      
      alert("Login correcto");

      navigate("/home");

    } catch (error) {

      alert("Credenciales incorrectas");

    }
  };

return (
  <div className="login-container">
    <div className="login-content">
      
      <div className="login-card">
        <h2>INGRESA TUS DATOS</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-login" type="submit">
            LOGIN
          </button>
        </form>
      </div>

      <div className="login-text">
        <div className="brand-logo">DashPoint <img src={barraIcon} alt=""/></div>
        <h1>MANEJA TU NEGOCIO <br /> A LO GRANDE</h1>
        <div className="cart-icon">🛒</div>
      </div>

    </div>
  </div>
);
}

export default Login;
