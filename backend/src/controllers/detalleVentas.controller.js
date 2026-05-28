import { pool } from "../config/db.js";

//    OBTENER DETALLE POR VENTA

export const getDetalleByVenta = async (req, res) => {
  try {
    const { id_ventas } = req.params;

    const { rows } = await pool.query(
      `SELECT dv.*, p.nombre_producto
       FROM detalle_ventas dv
       JOIN productos p 
      ON dv.id_producto = p.id_producto
       WHERE dv.id_ventas = $1`,
      [id_ventas]
    );

    return res.json(rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno" });
  }
};