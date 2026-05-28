import bcrypt from "bcrypt";
import { pool } from "../config/db.js"; // ajusta si tu ruta es distinta
import dotenv from "dotenv";

dotenv.config();

const crearAdmin = async () => {
  try {
    const passwordPlano = "Admin123*";
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    const query = `
      INSERT INTO usuarios (
        nombre_usuario,
        correo,
        numero_telefonico,
        password_hash,
        rol,
        estado
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_usuario;
    `;

    const values = [
      "Administrador",
      "admin@sistema.com",
      null,
      passwordHash,
      "admin",
      "activo"
    ];

    const result = await pool.query(query, values);

    console.log("Admin creado con ID:", result.rows[0].id_usuario);
    process.exit();

  } catch (error) {
    console.error("Error creando admin:", error);
    process.exit(1);
  }
};

crearAdmin();