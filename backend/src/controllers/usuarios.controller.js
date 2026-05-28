import {pool} from "../config/db.js"
import bcrypt from "bcrypt";

/* =========================
   CREAR USUARIO (SOLO ADMIN)
========================= */
export const crearUsuario = async (req, res) => {
  console.log(req.body);
console.log(req.file);
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const {
      nombre_usuario,
      correo,
      numero_telefonico,
      password,
      rol
    } = req.body;

    if (!nombre_usuario || !correo || !password) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // 📸 obtener ruta de imagen
    const foto_url = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const result = await pool.query(
      `INSERT INTO usuarios
       (nombre_usuario, correo, numero_telefonico, password_hash, rol, foto_url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id_usuario, nombre_usuario, correo, rol, estado, foto_url`,
      [
        nombre_usuario,
        correo,
        numero_telefonico || null,
        password_hash,
        rol || "vendedor",
        foto_url
      ]
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    res.status(500).json({ error: "Error al crear usuario" });
  }
};
/* =========================
   OBTENER TODOS LOS USUARIOS
   (SOLO ADMIN)
========================= */
export const obtenerUsuarios = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const result = await pool.query(
      `SELECT id_usuario, nombre_usuario, correo,
              numero_telefonico, rol, estado,
              foto_url,
              fecha_creacion,
              fecha_actualizacion
       FROM usuarios
       WHERE estado = 'activo'
       ORDER BY id_usuario ASC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

/* =========================
   OBTENER USUARIO POR ID
========================= */
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 validar ID
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // 🔥 comparación estricta
    if (req.user.rol !== "admin" && req.user.id_usuario !== Number(id)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const result = await pool.query(
      `SELECT id_usuario, nombre_usuario, correo,
              numero_telefonico, rol, estado,
              foto_url,
              fecha_creacion,
              fecha_actualizacion
       FROM usuarios
       WHERE id_usuario = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

/* =========================
   ACTUALIZAR USUARIO
   (SOLO ADMIN)
========================= */

export const actualizarUsuario = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const { id } = req.params;

    const {
      nombre_usuario,
      numero_telefonico,
      rol,
      estado,
      password // 🔥 agregar
    } = req.body;

    // 🔥 manejar imagen
    const foto_url = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // 🔥 hash de password SOLO si viene
    let password_hash = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET nombre_usuario = COALESCE($1, nombre_usuario),
           numero_telefonico = COALESCE($2, numero_telefonico),
           rol = COALESCE($3, rol),
           estado = COALESCE($4, estado),
           foto_url = COALESCE($5, foto_url),
           password_hash = COALESCE($6, password_hash), -- 🔥 clave
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_usuario = $7
       RETURNING id_usuario, nombre_usuario, correo,
                 numero_telefonico, rol, estado, foto_url`,
      [
        nombre_usuario,
        numero_telefonico,
        rol,
        estado,
        foto_url,
        password_hash,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

/* =========================
   DESACTIVAR USUARIO
   (NO DELETE)
========================= */
export const desactivarUsuario = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const { id } = req.params;

    const result = await pool.query(
      `UPDATE usuarios
       SET estado = 'inactivo',
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_usuario = $1
       RETURNING id_usuario, nombre_usuario, estado`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario desactivado correctamente",
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al desactivar usuario" });
  }
};

export const obtenerUsuarioActual = async (req, res) => {
  try {
    const id = req.user.id_usuario;

    const result = await pool.query(
      `SELECT id_usuario, nombre_usuario, correo,
              numero_telefonico, rol, estado, foto_url
       FROM usuarios
       WHERE id_usuario = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuario actual" });
  }
};