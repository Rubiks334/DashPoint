import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js"; // 👈 IMPORTANTE

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: "Correo y contraseña requeridos" });
    }

    // 🔴 Verificación crítica
    if (!JWT_SECRET) {
      console.error("JWT_SECRET no está definido");
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    // 1️⃣ Buscar usuario
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE correo = $1`,
      [correo]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const usuario = result.rows[0];

    // 2️⃣ Verificar estado
    if (usuario.estado !== "activo") {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    // 3️⃣ Comparar contraseña
    const passwordValido = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 4️⃣ Generar token
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el login" });
  }
};