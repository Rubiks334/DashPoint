import { Router } from "express";
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  obtenerUsuarioActual
} from "../controllers/usuarios.controller.js";

import { verifyToken } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// GET
router.get("/", verifyToken, obtenerUsuarios);
router.get("/me",verifyToken, obtenerUsuarioActual);
router.get("/:id", verifyToken, obtenerUsuarioPorId);

// POST (con multer)
router.post("/", verifyToken, upload.single("foto"), crearUsuario);

// PUT (con multer)
router.put("/:id", verifyToken, upload.single("foto"), actualizarUsuario);

// DELETE (lógico)
router.put("/desactivar/:id", verifyToken, desactivarUsuario);



export default router;