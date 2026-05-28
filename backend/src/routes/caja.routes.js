import { Router } from "express";

import {
  abrirCaja,
  obtenerCajaActual,
  crearMovimientoCaja,
  obtenerMovimientosCaja,
  cerrarCaja,
  obtenerHistorialMovimientos
} from "../controllers/caja.controller.js";

import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

/* =========================
   CAJA
========================= */

// abrir caja
router.post("/abrir", verifyToken, abrirCaja);

// obtener caja abierta
router.get("/actual", verifyToken, obtenerCajaActual);

// cerrar caja
router.post("/cerrar", verifyToken, cerrarCaja);


/* =========================
   MOVIMIENTOS DE CAJA
========================= */

// registrar gasto / ingreso / ajuste
router.post("/movimiento", verifyToken, crearMovimientoCaja);

// ver movimientos de caja actual
router.get("/movimientos", verifyToken, obtenerMovimientosCaja);
router.get("/movimientos/historial",verifyToken,  obtenerHistorialMovimientos);

export default router;