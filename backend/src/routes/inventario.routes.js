import { Router } from "express";
import {
  registrarEntrada,
  obtenerStockGeneral,
  obtenerMovimientos,
  registrarAjuste
} from '../controllers/inventario.controller.js';
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

// 🔥 STOCK GENERAL (LO QUE USA TU FRONT)
router.get("/", verifyToken, obtenerStockGeneral);

// 🔥 MOVIMIENTOS POR PRODUCTO
router.get("/movimientos/:id_producto", verifyToken, obtenerMovimientos);

// 🔥 ENTRADAS
router.post("/entrada", verifyToken, registrarEntrada);

// 🔥 AJUSTES
router.post("/ajuste", verifyToken, registrarAjuste);

export default router;