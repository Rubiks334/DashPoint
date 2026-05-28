import { useEffect, useState } from "react";
import api from "../../services/api";
import "./dashboard.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {

  const [ventasDia, setVentasDia] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [ventasAnio, setVentasAnio] = useState([]);
  const [finanzas, setFinanzas] = useState({
    ganancias: 0,
    gastos: 0,
    inversiones: 0,
    perdidas: 0
  });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [vd, vm, va, fin, prod] = await Promise.all([
          api.get("/dashboard/ventas-dia"),
          api.get("/dashboard/ventas-mes"),
          api.get("/dashboard/ventas-anio"),
          api.get("/dashboard/finanzas"),
          api.get("/dashboard/productos-top"),
        ]);

        console.log("Ventas día:", vd.data);
        console.log("Ventas mes:", vm.data);
        console.log("Ventas año:", va.data);
        console.log("Finanzas:", fin.data);
        console.log("Productos:", prod.data);

        setVentasDia(vd.data || []);
        setVentasMes(vm.data || []);
        setVentasAnio(va.data || []);
        setFinanzas(fin.data || {});
        setProductos(prod.data || []);

      } catch (error) {
        console.error("❌ Error cargando dashboard:", error);
      }
    };

    cargar();
  }, []);

  const dataFinanzas = [
    { name: "Ganancias", value: Number(finanzas.ganancias || 0) },
    { name: "Gastos", value: Number(finanzas.gastos || 0) },
    { name: "Inversiones", value: Number(finanzas.inversiones || 0) },
    { name: "Pérdidas", value: Number(finanzas.perdidas || 0) },
  ];

  const sinDatosFinanzas = dataFinanzas.every(d => d.value === 0);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">

      <h2>📊 Dashboard</h2>

      {/* ===== KPIs ===== */}
      <div className="kpis">
        <div className="kpi">
          <h3>Ventas Hoy</h3>
          <p>
            ${ventasDia.reduce((acc, v) => acc + Number(v.total || 0), 0)}
          </p>
        </div>

        <div className="kpi">
          <h3>Ventas Mes</h3>
          <p>
            ${ventasMes.reduce((acc, v) => acc + Number(v.total || 0), 0)}
          </p>
        </div>

        <div className="kpi">
          <h3>Gastos</h3>
          <p>${finanzas.gastos || 0}</p>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="dashboard-grid">

        {/* Ventas Semanales */}
        <div className="card">
          <h2>📅 Ventas Semanales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventasDia}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas Mensuales */}
        <div className="card">
          <h2>📆 Ventas Mensuales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventasMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas Anuales */}
        <div className="card">
          <h2>📈 Ventas Anuales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ventasAnio}>
              <XAxis dataKey="anio" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Finanzas */}
        <div className="card">
          <h2>💰 Finanzas</h2>

          {sinDatosFinanzas ? (
            <p className="empty">No hay datos financieros</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataFinanzas}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {dataFinanzas.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

          )}
        </div>

        {/* Productos */}
        <div className="card">
          <h2>🏆 Productos más vendidos</h2>

          {productos.length === 0 ? (
            <p className="empty">Sin datos</p>
          ) : (
            <ul className="productos-list">
              {productos.map((p, index) => (
                <li key={`${p.id_producto || p.nombre_producto}-${index}`}>
                  <span>{p.nombre_producto}</span>
                  <span>{p.total_vendido}</span>
                </li>
              ))}
            </ul>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;