import { pool } from "../config/db.js";

/* =========================
   CREAR VENTA
========================= */
export const crearVenta = async (req, res) => {
  const client = await pool.connect();

  try {
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: "Debe incluir productos en la venta" });
    }

    await client.query("BEGIN");

    // 🔎 verificar caja abierta
    const cajaResult = await client.query(
      `SELECT * FROM cajas 
       WHERE id_usuario = $1 AND estado = 'abierta'`,
      [req.user.id_usuario]
    );

    if (cajaResult.rowCount === 0) {
      throw new Error("No hay caja abierta");
    }

    const caja = cajaResult.rows[0];

    let total = 0;

    // 1️⃣ crear venta
    const ventaResult = await client.query(
      `INSERT INTO ventas (id_usuario, id_caja)
       VALUES ($1,$2)
       RETURNING *`,
      [req.user.id_usuario, caja.id_caja]
    );

    const venta = ventaResult.rows[0];

    // 2️⃣ procesar productos
    for (const item of productos) {

      const stockResult = await client.query(
        `SELECT COALESCE(SUM(cantidad),0) AS stock
         FROM inventario_movimientos
         WHERE id_producto = $1`,
        [item.id_producto]
      );

      const stockActual = parseInt(stockResult.rows[0].stock);

      if (stockActual < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto ID ${item.id_producto}`
        );
      }

      // obtener precios
      const productoResult = await client.query(
        `SELECT precio_venta, precio_compra
         FROM productos
         WHERE id_producto = $1`,
        [item.id_producto]
      );

      if (productoResult.rowCount === 0) {
        throw new Error(`Producto ID ${item.id_producto} no existe`);
      }

      const precioVenta = productoResult.rows[0].precio_venta;
      const costoUnitario = productoResult.rows[0].precio_compra;

      const subtotal = precioVenta * item.cantidad;

      total += subtotal;

      // insertar detalle
      await client.query(
        `INSERT INTO detalle_ventas
        (cantidad, precio_unitario, costo_unitario, subtotal, id_producto, id_venta)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          item.cantidad,
          precioVenta,
          costoUnitario,
          subtotal,
          item.id_producto,
          venta.id_venta
        ]
      );

      // movimiento inventario
      await client.query(
        `INSERT INTO inventario_movimientos
        (tipo, cantidad, comentarios, id_producto, id_usuario)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          "salida",
          -item.cantidad,
          `Venta ID ${venta.id_venta}`,
          item.id_producto,
          req.user.id_usuario
        ]
      );
    }

    // actualizar total
    await client.query(
      `UPDATE ventas
       SET total = $1
       WHERE id_venta = $2`,
      [total, venta.id_venta]
    );

    // movimiento caja
    await client.query(
      `INSERT INTO caja_movimientos
      (tipo, monto, id_caja, id_usuario, id_venta)
      VALUES ('venta',$1,$2,$3,$4)`,
      [
        total,
        caja.id_caja,
        req.user.id_usuario,
        venta.id_venta
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Venta creada correctamente",
      id_venta: venta.id_venta,
      total
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

/* =========================
   CANCELAR VENTA
========================= */
export const cancelarVenta = async (req, res) => {

  const client = await pool.connect();

  try {

    const { id } = req.params;

    await client.query("BEGIN");

    /* =========================
       1️⃣ Buscar venta
    ========================= */
    const ventaResult = await client.query(
      `SELECT * FROM ventas WHERE id_venta = $1`,
      [id]
    );

    if (ventaResult.rowCount === 0) {
      throw new Error("Venta no encontrada");
    }

    const venta = ventaResult.rows[0];

    if (venta.estado === "cancelada") {
      throw new Error("La venta ya está cancelada");
    }

    /* =========================
       2️⃣ Obtener caja de la venta
    ========================= */
    const cajaResult = await client.query(
      `SELECT * FROM cajas WHERE id_caja = $1`,
      [venta.id_caja]
    );

    if (cajaResult.rowCount === 0) {
      throw new Error("Caja no encontrada");
    }

    const caja = cajaResult.rows[0];

    /* =========================
       ⚠️ Validar caja abierta
    ========================= */
    if (caja.estado === "cerrada") {
      throw new Error("No puedes cancelar una venta de una caja cerrada");
    }

    /* =========================
       3️⃣ Obtener detalles
    ========================= */
    const detalles = await client.query(
      `SELECT * FROM detalle_ventas WHERE id_venta = $1`,
      [id]
    );

    /* =========================
       4️⃣ Devolver inventario
    ========================= */
    for (const item of detalles.rows) {

      await client.query(
        `INSERT INTO inventario_movimientos
        (tipo, cantidad, comentarios, id_producto, id_usuario)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          "entrada",
          item.cantidad,
          `Cancelación venta ID ${id}`,
          item.id_producto,
          req.user.id_usuario
        ]
      );

    }

    /* =========================
       5️⃣ Movimiento de caja
    ========================= */
    await client.query(
      `INSERT INTO caja_movimientos
       (tipo, monto, descripcion, id_caja, id_usuario, id_venta)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        "retiro", // 🔥 dinero sale de caja
        venta.total,
        `Cancelación venta ID ${id}`,
        caja.id_caja,
        req.user.id_usuario,
        id
      ]
    );

    /* =========================
       6️⃣ Cancelar venta
    ========================= */
    await client.query(
      `UPDATE ventas
       SET estado = 'cancelada'
       WHERE id_venta = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      mensaje: "Venta cancelada correctamente"
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
/* =========================
   OBTENER VENTAS
========================= */
export const obtenerVentas = async (req, res) => {

  try {

    let query;
    let values = [];

    if (req.user.rol === "admin") {

      query = `
        SELECT v.*, u.nombre_usuario
        FROM ventas v
        JOIN usuarios u ON v.id_usuario = u.id_usuario
        ORDER BY v.fecha_hora DESC
      `;

    } else {

      query = `
        SELECT v.*, u.nombre_usuario
        FROM ventas v
        JOIN usuarios u ON v.id_usuario = u.id_usuario
        WHERE v.id_usuario = $1
        ORDER BY v.fecha_hora DESC
      `;

      values = [req.user.id_usuario];
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener ventas"
    });

  }

};

/* =========================
   OBTENER VENTA POR ID
========================= */
export const obtenerVentaPorId = async (req, res) => {

  try {

    const { id } = req.params;

    const ventaResult = await pool.query(
      `SELECT v.*, u.nombre_usuario
       FROM ventas v
       JOIN usuarios u ON v.id_usuario = u.id_usuario
       WHERE v.id_venta = $1`,
      [id]
    );

    if (ventaResult.rowCount === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const venta = ventaResult.rows[0];

    if (
      req.user.rol !== "admin" &&
      venta.id_usuario !== req.user.id_usuario
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const detalleResult = await pool.query(
      `SELECT d.*, p.nombre_producto
       FROM detalle_ventas d
       JOIN productos p ON d.id_producto = p.id_producto
       WHERE d.id_venta = $1`,
      [id]
    );

    res.json({
      venta,
      detalle: detalleResult.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener la venta"
    });

  }

};