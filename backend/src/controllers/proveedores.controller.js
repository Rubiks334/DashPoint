import {pool} from "../config/db.js"
//GET
export const getProv = async(req, res) => {//usando los metodos de Router (request y response)
    const {rows} = await pool.query('SELECT * FROM proveedores');
    
    res.json(rows)
}
//GET:ID
export const getProvByid = async (req, res) => {
    const {id_proveedor} = req.params;
    const {rows} = await pool.query('SELECT * FROM proveedores WHERE id_proveedor = $1', [id_proveedor]);

    if (rows.length === 0){
        return res.status(404).json({mensaje: "Proveedor no encontrado"})
    } 
    res.json(rows[0]);
}
//DELETE
export const deleteProv = async (req, res) => {
    const {id_proveedor} = req.params;
    const {rows, rowCount} = await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1 RETURNING *', [id_proveedor]);
    console.log(rows)

    if (rowCount === 0){
        return res.status(404).json({message: "Proveedor no encontrado"});
    }
    return res.sendStatus(204)
}
//CREATE
export const createProv = async (req, res) => {//usando los metodos de Router (request y response)
   try {
    const {nombre_empresa,nombre_contacto, correo,numero_telefonico,direccion} = req.body
    const {rows} = await pool.query(
    "INSERT INTO proveedores (nombre_empresa, nombre_contacto, correo, numero_telefonico, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre_empresa, nombre_contacto, correo, numero_telefonico, direccion]
    )
    return res.json(rows[0]);
   } catch (error) {
    console.log(error);
    if (error?.code === "23505") {
        return res.status(409).json({mensaje: "El correo ya existe"});
    }

    return res.status(500).json({mensaje: "Error interno"})
    
   }

}
//UPDATE
export const updateProv = async (req, res) => {//usando los metodos de Router (request y response)
    const {id_proveedor} = req.params;
    const {nombre_empresa,nombre_contacto,correo,numero_telefonico,direccion} = req.body;

    const {rows} = await pool.query(
        "UPDATE proveedores SET nombre_empresa = $1, nombre_contacto = $2, correo = $3, numero_telefonico = $4, direccion = $5 WHERE id_proveedor = $6 RETURNING *",
        [nombre_empresa, nombre_contacto, correo, numero_telefonico, direccion, id_proveedor]
    );
     if (rows.length === 0){
        return res.status(404).json({mensaje: "Proveedor no encontrado"})
    } 
    return res.json(rows[0]);
}