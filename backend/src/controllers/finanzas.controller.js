import { pool } from "../config/db.js";

/* =========================
   CREAR REGISTRO FINANCIERO
========================= */
export const crearRegistroFinanciero = async (req, res) => {
  try {

    const { tipo, monto, descripcion } = req.body;

    const result = await pool.query(
      `INSERT INTO finanzas
      (tipo, monto, descripcion, id_usuario)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [tipo, monto, descripcion, req.user.id_usuario]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error al registrar movimiento financiero" });

  }
};


/* =========================
   OBTENER REGISTROS
========================= */
export const obtenerRegistrosFinancieros = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM finanzas
      ORDER BY fecha DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error al obtener registros financieros" });

  }

};


/* =========================
   OBTENER REGISTRO POR ID
========================= */
export const obtenerRegistroPorId = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM finanzas WHERE id_finanza = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error al obtener registro" });

  }

};


/* =========================
   ACTUALIZAR REGISTRO
========================= */
export const actualizarRegistroFinanciero = async (req, res) => {

  try {

    const { id } = req.params;
    const { tipo, monto, descripcion } = req.body;

    const result = await pool.query(
      `UPDATE finanzas
      SET tipo = $1,
          monto = $2,
          descripcion = $3
      WHERE id_finanza = $4
      RETURNING *`,
      [tipo, monto, descripcion, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error al actualizar registro" });

  }

};


/* =========================
   ELIMINAR REGISTRO
========================= */
export const eliminarRegistroFinanciero = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM finanzas WHERE id_finanza = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ mensaje: "Registro eliminado" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error al eliminar registro" });

  }

};