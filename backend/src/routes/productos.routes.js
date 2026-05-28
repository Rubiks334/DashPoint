import { Router } from "express";
import { createProdu, deleteProdu, getProdu, getProduById, updateProdu } from '../controllers/productos.controller.js'

const router = Router()

router.get('/',getProdu);

router.get('/:id_producto',getProduById);

router.post('/',createProdu);

router.delete('/:id_producto',deleteProdu);

router.put('/:id_producto',updateProdu);

export default router;