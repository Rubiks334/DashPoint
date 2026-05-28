import { Router } from "express";
import {getDetalleByVenta} from '../controllers/detalleVentas.controller.js'
const router = Router();

router.get("/:id_ventas", getDetalleByVenta);

export default router;
