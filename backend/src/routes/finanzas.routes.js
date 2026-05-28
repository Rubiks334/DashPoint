import { Router } from "express";

import {
  crearRegistroFinanciero,
  obtenerRegistrosFinancieros,
  obtenerRegistroPorId,
  actualizarRegistroFinanciero,
  eliminarRegistroFinanciero
} from "../controllers/finanzas.controller.js";

import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/", verifyToken, crearRegistroFinanciero);

router.get("/", verifyToken, obtenerRegistrosFinancieros);

router.get("/:id", verifyToken, obtenerRegistroPorId);

router.put("/:id", verifyToken, actualizarRegistroFinanciero);

router.delete("/:id", verifyToken, eliminarRegistroFinanciero);

export default router;