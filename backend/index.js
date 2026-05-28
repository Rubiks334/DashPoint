import express from 'express';//import es una palabra reservada que se utiliza para importar librerias, metodos, variables, frameworks
import {PORT} from './src/config/config.js';//importando el puerto 
import provRoutes from './src/routes/proveedores.routes.js';//importando los endpoints (rutas) de provedores
import userRoutes from './src/routes/usuarios.routes.js';
import produRoutes from './src/routes/productos.routes.js';
import inventRoutes from './src/routes/inventario.routes.js';
import ventaRouter from './src/routes/ventas.routes.js';
import detalleVenRouter from './src/routes/detalleVentas.router.js';
import loginRouter from './src/routes/auth.router.js';
import cajaRouter from './src/routes/caja.routes.js';
import finanzaRouter from './src/routes/finanzas.routes.js';
import dashRouter from './src/routes/dashboard.routes.js';
import morgan from 'morgan';
import cors from 'cors';


const app = express();//creacion de objeto app para usar metodos de express
// 🔑 Configuración de CORS
app.use(cors({
  origin: "http://localhost:5173", // tu frontend
  credentials: true
}));


app.use(morgan('dev'));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/usuarios",userRoutes);
app.use("/proveedores",provRoutes);//utilizando el metodo use para utilizar los endpoints de proveedores
app.use("/productos",produRoutes);
app.use("/inventario",inventRoutes);
app.use("/ventas",ventaRouter);
app.use("/detalle-ventas",detalleVenRouter);
app.use("/caja",cajaRouter);
app.use("/finanzas",finanzaRouter);
app.use("/auth",loginRouter);
app.use("/dashboard", dashRouter);
app.listen(PORT);//utilizando el metodo listen para que el programa escuche el puerto asignado
console.log('Servidor escuchando en el puerto', PORT)//Imprimir en consola

