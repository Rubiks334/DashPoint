import { Router } from "express";
import { resumenFinanzas, topProductos, ventasPorAnio, ventasPorDia, ventasPorMes } from "../controllers/dashboard.controller.js";

import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/ventas-dia", verifyToken, ventasPorDia);
router.get("/ventas-mes", verifyToken, ventasPorMes);
router.get("/finanzas", verifyToken, resumenFinanzas);
router.get("/productos-top", verifyToken, topProductos);
router.get("/ventas-anio", verifyToken, ventasPorAnio);
export default router;