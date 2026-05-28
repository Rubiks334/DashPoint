import { pool } from "../config/db.js";

/* =========================
   ABRIR CAJA
========================= */
export const abrirCaja = async (req, res) => {

  try {

    const { fondo_inicial } = req.body;

    if (!fondo_inicial || fondo_inicial <= 0) {
          return res.status(400).json({
            error: "El fondo inicial debe ser mayor a 0"
          });
        }
    // verificar si ya hay caja abierta
    const cajaAbierta = await pool.query(
      `SELECT * FROM cajas WHERE estado = 'abierta'`
    );

    if (cajaAbierta.rowCount > 0) {
      return res.status(400).json({
        error: "Ya existe una caja abierta"
      });
    }

    const result = await pool.query(
      `INSERT INTO cajas (fondo_inicial, id_usuario)
       VALUES ($1,$2)
       RETURNING *`,
      [fondo_inicial, req.user.id_usuario]
    );

    res.status(201).json({
      mensaje: "Caja abierta correctamente",
      caja: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al abrir caja"
    });

  }

};


/* =========================
   OBTENER CAJA ACTUAL
========================= */
export const obtenerCajaActual = async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM cajas
       WHERE id_usuario = $1
       AND estado = 'abierta'`,
      [req.user.id_usuario]
    );

    if (result.rowCount === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener caja"
    });

  }

};


/* =========================
   MOVIMIENTO DE CAJA
========================= */
export const crearMovimientoCaja = async (req, res) => {

  try {

    const { tipo, monto, descripcion } = req.body;

    // buscar caja abierta
    const cajaResult = await pool.query(
      `SELECT * FROM cajas WHERE estado = 'abierta' LIMIT 1`
    );

    if (cajaResult.rowCount === 0) {
      return res.status(400).json({
        error: "No hay caja abierta"
      });
    }

    const caja = cajaResult.rows[0];

    await pool.query(
      `INSERT INTO caja_movimientos
      (tipo, monto, descripcion, id_caja, id_usuario)
      VALUES ($1,$2,$3,$4,$5)`,
      [
        tipo,
        monto,
        descripcion,
        caja.id_caja,
        req.user.id_usuario
      ]
    );

    res.json({
      mensaje: "Movimiento registrado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al registrar movimiento de caja"
    });

  }

};


/* =========================
   OBTENER MOVIMIENTOS
========================= */
export const obtenerMovimientosCaja = async (req, res) => {

  try {

    const cajaResult = await pool.query(
      `SELECT * FROM cajas
       WHERE id_usuario = $1
       AND estado = 'abierta'`,
      [req.user.id_usuario]
    );

    if (cajaResult.rowCount === 0) {
      return res.status(400).json({
        error: "No hay caja abierta"
      });
    }

    const caja = cajaResult.rows[0];

    const movimientos = await pool.query(
      `SELECT *
       FROM caja_movimientos
       WHERE id_caja = $1
       ORDER BY fecha DESC`,
      [caja.id_caja]
    );

    res.json(movimientos.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener movimientos"
    });

  }

};


/* =========================
   CERRAR CAJA
========================= */
export const cerrarCaja = async (req, res) => {

  const client = await pool.connect();

  try {

    const { fondo_final } = req.body;
     if (!fondo_final || fondo_final <= 0) {
          return res.status(400).json({
            error: "El fondo final debe ser mayor a 0"
          });
        }

    await client.query("BEGIN");

    /* =========================
       1️⃣ Buscar caja abierta
    ========================= */

    const cajaResult = await client.query(
      `SELECT *
       FROM cajas
       WHERE id_usuario = $1
       AND estado = 'abierta'
       LIMIT 1`,
      [req.user.id_usuario]
    );

    if (cajaResult.rowCount === 0) {
      throw new Error("No hay caja abierta");
    }

    const caja = cajaResult.rows[0];

    /* =========================
       2️⃣ Calcular movimientos
    ========================= */

    const movimientos = await client.query(
      `SELECT
        COALESCE(SUM(
          CASE
            WHEN tipo IN ('venta','ingreso') THEN monto
            WHEN tipo = 'retiro' THEN -monto
            ELSE 0
          END
        ),0) AS balance
       FROM caja_movimientos
       WHERE id_caja = $1`,
      [caja.id_caja]
    );

    const balance = Number(movimientos.rows[0].balance);

    const esperado =
      Number(caja.fondo_inicial) +
      balance;

    /* =========================
       3️⃣ Cerrar caja
    ========================= */

    await client.query(
      `UPDATE cajas
       SET estado = 'cerrada',
           fondo_final = $1,
           fecha_cierre = NOW()
       WHERE id_caja = $2`,
      [
        fondo_final,
        caja.id_caja
      ]
    );

    await client.query("COMMIT");

    res.json({
      mensaje: "Caja cerrada correctamente",
      fondo_inicial: Number(caja.fondo_inicial),
      monto_esperado: esperado,
      monto_real: fondo_final,
      diferencia: Number(fondo_final) - esperado
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  } finally {

    client.release();

  }

};

export const obtenerHistorialMovimientos = async (req, res) => {
  try {

    let query;
    let values = [];

    // 🔐 admin ve todo
    if (req.user.rol === "admin") {

      query = `
        SELECT 
          cm.*,
          c.fecha_apertura,
          c.fecha_cierre,
          u.nombre_usuario
        FROM caja_movimientos cm
        JOIN cajas c ON cm.id_caja = c.id_caja
        LEFT JOIN usuarios u ON cm.id_usuario = u.id_usuario
        ORDER BY cm.fecha DESC
      `;

    } else {

      // 👤 vendedor solo ve lo suyo
      query = `
        SELECT 
          cm.*,
          c.fecha_apertura,
          c.fecha_cierre,
          u.nombre_usuario
        FROM caja_movimientos cm
        JOIN cajas c ON cm.id_caja = c.id_caja
        LEFT JOIN usuarios u ON cm.id_usuario = u.id_usuario
        WHERE c.id_usuario = $1
        ORDER BY cm.fecha DESC
      `;

      values = [req.user.id_usuario];
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener historial de movimientos"
    });

  }
};