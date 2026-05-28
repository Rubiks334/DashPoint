import { Router } from "express";//importando el modulo Router de express
import { getProv, getProvByid, deleteProv, createProv, updateProv } from "../controllers/proveedores.controller.js";
const router = Router();//asignando una constante para utilizar Router
//C-reate
//R-ead
//U-pdate
//D-elete
router.get('/', getProv);
//GET
router.get('/:id_proveedor', getProvByid);
//DELETE
router.delete('/:id_proveedor', deleteProv);
//POST
router.post('/', createProv);

router.put('/:id_proveedor', updateProv);

export default router;//exportamos router como default
