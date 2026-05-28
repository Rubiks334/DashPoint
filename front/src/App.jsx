import React from 'react'
import { Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout.jsx";
import ProtegerRutas from './routes/ProtegerRutas.jsx';
import Login from './pages/login/login.jsx'
import Home from './pages/home/Home.jsx'
import Ventas from './pages/ventas/ventas.jsx';
import Productos from './pages/productos/productos.jsx';
import Inventario from './pages/inventario/inventario.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Finanzas from './pages/finanzas/finanzas.jsx';
import Proveedores from './pages/proveedores/proveedores.jsx';
import Usuarios from './pages/usuarios/usuarios.jsx';
import Caja from './pages/caja/caja.jsx';
import VentaDetalle from './pages/ventas/ventasDetalle.jsx';
import ProveedorForm from './pages/proveedores/proveedorForm.jsx';
import CrearVenta from './pages/ventas/crearVenta.jsx';
import UsuarioForm from './pages/usuarios/usuarioForm.jsx';
import ProductoForm from './pages/productos/ProductoForm.jsx';
import EntradaInventario from './pages/inventario/EntradaInventario.jsx';
import Movimientos from './pages/inventario/Movimientos.jsx';
import AjusteForm from './pages/inventario/AjusteForm.jsx';
import FinanzaForm from './pages/finanzas/finanzasForm.jsx';


const App = () => {
  return (
  <Routes>
    <Route path='/' element={<Login />} />
      <Route element={<ProtegerRutas/>}>
        <Route element={<HomeLayout/>}>
            <Route path='/home' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/ventas' element={<Ventas />} />
            <Route path='/ventas/:id' element={<VentaDetalle />} />
            <Route path='/crearventas' element={<CrearVenta />} />
            <Route path='/productos' element={<Productos />} />
            <Route path='/productos/nuevo' element={<ProductoForm />} />
            <Route path='/productos/editar/:id' element={<ProductoForm />} />
            <Route path='/inventario' element={<Inventario />} />
            <Route path='/inventario/entrada/:id' element={<EntradaInventario />} />
            <Route path='/inventario/movimientos/:id' element={<Movimientos />} />
            <Route path='/inventario/ajuste/:id' element={<AjusteForm />} />
            <Route path='/proveedores' element={<Proveedores />} />
            <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
            <Route path="/proveedores/editar/:id" element={<ProveedorForm />} />
            <Route path='/usuarios' element={<Usuarios />} />
            <Route path='/usuarios/nuevo' element={<UsuarioForm />} />
            <Route path='/usuarios/editar/:id' element={<UsuarioForm />} />
            <Route path='/finanzas' element={<Finanzas />} />
            <Route path='/finanzas/nuevo' element={<FinanzaForm />} />
            <Route path='/finanzas/editar/:id' element={<FinanzaForm />} />
            <Route path='/caja' element={<Caja />} />
        </Route>
      </Route>

  </Routes>
  )
}

export default App
