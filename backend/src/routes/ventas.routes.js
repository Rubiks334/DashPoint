import { Router } from "express";
import {crearVenta,cancelarVenta,obtenerVentas,obtenerVentaPorId} from '../controllers/ventas.controller.js'
import { verifyToken } from "../middlewares/auth.middlewares.js";
const router = Router();

router.post("/", verifyToken, crearVenta);
router.put("/cancelar/:id", verifyToken, cancelarVenta);

router.get("/", verifyToken, obtenerVentas);
router.get("/detalles/:id", verifyToken, obtenerVentaPorId);
export default router;