import { pool } from "../config/db.js";

/* =========================
   VENTAS POR SEMANA (DÍAS)
========================= */
export const ventasPorDia = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(fecha_hora, 'Day') AS dia,
        SUM(total) as total
      FROM ventas
      WHERE estado = 'completada'
      AND fecha_hora >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY dia
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error ventas por día" });
  }
};


/* =========================
   VENTAS POR MES (MES ACTUAL)
========================= */
export const ventasPorMes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(fecha_hora, 'Month') AS mes,
        SUM(total) as total
      FROM ventas
      WHERE estado = 'completada'
      GROUP BY mes
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error ventas por mes" });
  }
};


/* =========================
   VENTAS POR AÑO
========================= */
export const ventasPorAnio = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM fecha_hora) AS anio,
        SUM(total) AS total
      FROM ventas
      WHERE estado = 'completada'
      GROUP BY anio
      ORDER BY anio
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error ventas por año" });
  }
};


/* =========================
   RESUMEN FINANCIERO (PIE CHART)
========================= */
export const resumenFinanzas = async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT
  COALESCE(SUM(CASE WHEN tipo = 'ganancia' THEN monto ELSE 0 END), 0) AS ganancias,
  COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0) AS gastos,
  COALESCE(SUM(CASE WHEN tipo = 'inversion' THEN monto ELSE 0 END), 0) AS inversiones,
  COALESCE(SUM(CASE WHEN tipo = 'perdida' THEN monto ELSE 0 END), 0) AS perdidas
FROM finanzas;
    `);

    res.json({
  ganancias: 0,
  perdidas: 0,
  gastos: Number(result.rows[0].gastos),
  inversiones: Number(result.rows[0].inversiones),
   ganancias: Number(result.rows[0].ganancias),
  perdidas: Number(result.rows[0].perdidas)
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error finanzas" });
  }
};


/* =========================
   TOP PRODUCTOS (RANKING)
========================= */
export const topProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.nombre_producto,
        SUM(dv.cantidad) AS total
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      JOIN ventas v ON dv.id_venta = v.id_venta
      WHERE v.estado = 'completada'
      GROUP BY p.nombre_producto
      ORDER BY total DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error ranking productos" });
  }
};