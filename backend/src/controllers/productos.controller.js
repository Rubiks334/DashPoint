import { pool } from "../config/db.js"; // importamos objeto pool para hacer consultas a la base de datos

//GET
export const getProdu = async(req, res) =>{ // exportamos la funcion para traer todos los productos
try {
   
    const {rows} = await pool.query(`SELECT 
  p.id_producto,
  p.nombre_producto,
  p.precio_compra,
  p.precio_venta,
  p.id_proveedor,
  pr.nombre_empresa
FROM productos p
JOIN proveedores pr 
ON p.id_proveedor = pr.id_proveedor`); 
    return res.json(rows);// respondemos con los productos existentes
} catch (error) {// En caso de error
    console.log(error); // imprimimos el error
    return res.status(500).json({mensaje: "Error interno"});// respondemos con el error al usuario
}
};

//GET:ID
export const getProduById = async(req,res) =>{ // exportamos la funcion para traer productos por ID

    try {// intenta
        const {id_producto} = req.params; // almacena el id que viene de los parametro (URL)
        const {rows} = await pool.query('SELECT * FROM productos WHERE id_producto = $1',[id_producto]); // mandamos y almacenamos la consulta a la base de datos
        
        if(rows.length === 0) { // si el conteo de los productos es 0
            return res.status(404).json({mensaje: "Producto no encontrado"}) // respondemos no encontrado
        }
        return res.json(rows[0]); // respondemos con la peticion exitosa

    } catch (error) { //En caso de error
        console.log(error); // imprimimos en consola el erro
        return res.status(500).json({mensaje: "Error interno"});// respondemos a la peticion con el error
    }
}
//CREATE
export const createProdu = async(req, res) =>{ // exportamos la funcion para crear productos 
    // desfragmentamos la peticion
    const { nombre_producto,
            precio_compra,
            precio_venta,
            id_proveedor} = req.body;

               // Validación básica
    if (!nombre_producto || !precio_compra || !precio_venta || !id_proveedor) { // si falta alguna variable
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });//respondemos que faltan campos
    }

    // Validar que proveedor exista
    const proveedorExiste = await pool.query( 
      "SELECT * FROM proveedores WHERE id_proveedor = $1", //consulta para traer el proveedor que te mandan por body
        [id_proveedor]
    );
  // si el conteo de filas es 0 
    if (proveedorExiste.rowCount === 0) {
        return res.status(400).json({ mensaje: "El proveedor no existe" }); // respondemos que no existe
    }
    // insertamos el nuevo producto 
    const {rows} = await pool.query('INSERT INTO productos (nombre_producto, precio_compra, precio_venta, id_proveedor) VALUES ($1,$2,$3,$4) RETURNING *',
        [nombre_producto,precio_compra,precio_venta,id_proveedor]);
        return res.json(rows); // respondemos la peticion con los datos de la insercion
}

//DELETE
export const deleteProdu = async(req,res) =>{
    try {
        const {id_producto} = req.params;
        const {rowCount} = await pool.query('DELETE FROM productos WHERE id_producto = $1',[id_producto]);
        if (rowCount === 0) {
            res.status(404).json({mensaje: "Producto no encontrado"})
        }
        return res.sendStatus(204)
    } catch (error) {
        console.log(error);

        if (error?.code === "23503") {
            return res.status(400).json({mensaje:"No se puede eliminar, tiene registros asociados"});
        }
        return res.status(500).json({mensaje:"Error interno"});
    }
    
}
//UPDATE
export const updateProdu = async(req,res)=>{
    try {
        const {id_producto} = req.params;
        const { nombre_producto,
                precio_compra,
                precio_venta,
                id_proveedor} = req.body;
         // Validar que proveedor exista
        const proveedorExiste = await pool.query( 
        "SELECT * FROM proveedores WHERE id_proveedor = $1", //consulta para traer el proveedor que te mandan por body
            [id_proveedor]
        );
        // si el conteo de filas es 0 
        if (proveedorExiste.rowCount === 0) {
            return res.status(400).json({ mensaje: "El proveedor no existe" }); // respondemos que no existe
        }
        const {rows, rowCount} = await pool.query('UPDATE productos SET nombre_producto = $1, precio_compra = $2, precio_venta = $3, id_proveedor = $4 WHERE id_producto = $5 RETURNING *',
                [nombre_producto,precio_compra,precio_venta,id_proveedor,id_producto]);

        if (rowCount === 0) {
            res.status(404).json({mensaje:"Producto no encontrado"})
        }
        return res.json(rows[0])
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({mensaje:"Error interno"});
        
        
    }
}

