import {pool} from '../config/db.js'


/* =========================
   REGISTRAR ENTRADA
   (Compra o ingreso manual)
========================= */
export const registrarEntrada = async (req, res) => {
  try {
    const { id_producto, cantidad, comentarios } = req.body;

    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    await pool.query(
      `INSERT INTO inventario_movimientos
       (tipo, cantidad, comentarios, id_producto, id_usuario)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        "entrada",
        cantidad, // positivo
        comentarios || "Entrada manual",
        id_producto,
        req.user.id_usuario
      ]
    );

    res.status(201).json({ mensaje: "Entrada registrada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar entrada" });
  }
};

/* =========================
   REGISTRAR AJUSTE
========================= */
export const registrarAjuste = async (req, res) => {
  try {
    const { id_producto, cantidad, comentarios } = req.body;

    if (!id_producto || cantidad == null) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    await pool.query(
      `INSERT INTO inventario_movimientos
       (tipo, cantidad, comentarios, id_producto, id_usuario)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        "ajuste",
        cantidad, // puede ser positivo o negativo
        comentarios || "Ajuste administrativo",
        id_producto,
        req.user.id_usuario
      ]
    );

    res.json({ mensaje: "Ajuste registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar ajuste" });
  }
};

/* =========================
   OBTENER STOCK ACTUAL
========================= */
export const obtenerStockGeneral = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre_producto,
        p.precio_venta,
        COALESCE(SUM(im.cantidad), 0) AS stock
      FROM productos p
      LEFT JOIN inventario_movimientos im 
        ON p.id_producto = im.id_producto
      GROUP BY p.id_producto, p.nombre_producto, p.precio_venta
      ORDER BY p.nombre_producto
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener inventario" });
  }
};

/* =========================
  OBTENER HISTORIAL DE MOVIMIENTOS
========================= */
export const obtenerMovimientos = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const result = await pool.query(
      `SELECT m.*, u.nombre_usuario
       FROM inventario_movimientos m
       LEFT JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_producto = $1
       ORDER BY m.fecha_movimiento DESC`,
      [id_producto]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
};