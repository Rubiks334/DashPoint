# DashPoint 
### Sistema Inteligente de Punto de Venta y Analítica Financiera para PyMEs

## Descripción General

**DashPoint** es un ecosistema de software con arquitectura desacoplada diseñado para modernizar y automatizar la gestión operativa de micro, pequeñas y medianas empresas (PyMEs). El sistema resuelve la transición crítica desde el control informal o manual (como hojas de cálculo en Excel o registros en papel) hacia una administración digital centralizada.

El proyecto permite automatizar de forma segura el flujo diario de caja, enlazar transacciones a los usuarios en sesión, gestionar de manera estricta el inventario mediante movimientos de entrada/salida y proyectar analíticas visuales de alto nivel a través de dashboards financieros interactivos.

**Contexto de desarrollo:** Este sistema fue desarrollado como proyecto integrador para la materia de **Ingeniería de Software** en el **TecMM Campus Zapopan**, respondiendo a problemáticas transaccionales reales detectadas en el comercio minorista local.

---

## Objetivos

### Objetivo General
Diseñar, codificar e implementar un sistema de Punto de Venta (POS) y Gestión de Inventarios robusto, que integre módulos de analítica financiera automatizados mediante Dashboards interactivos, utilizando una arquitectura desacoplada para optimizar el rendimiento transaccional y la administración de recursos en PyMEs en crecimiento.

### Objetivos Específicos
- Establecer un control operativo ágil para registrar ventas multi-producto con cálculo automatizado de subtotales, impuestos y totales netos.
- Garantizar la seguridad y persistencia relacional inmutable mediante la encriptación avanzada de credenciales de usuario.
- Proveer herramientas de inteligencia de negocio (*Business Intelligence*) a través de componentes gráficos que proyecten balances financieros netos (ganancias, pérdidas, gastos e inversiones).
- Orquestar la solución en contenedores ligeros que faciliten la portabilidad absoluta y un despliegue libre de errores de configuración en entornos locales.

---

## Tecnologías Utilizadas

El núcleo del sistema se construyó bajo una división estricta de responsabilidades (Frontend, Backend y Base de Datos) utilizando el siguiente stack tecnológico profesional:

| Capa / Componente | Tecnología | Función Específica |
| :--- | :--- | :--- |
| **Frontend (Cliente)** | React (Vite) | Creación de una *Single Page Application* (SPA) interactiva, fluida y reactiva para el operador en mostrador. |
| **Backend (Servidor)** | Node.js / Express | Construcción de una API REST asíncrona encargada de la lógica de negocio, enrutamiento y middlewares de seguridad. |
| **Base de Datos** | PostgreSQL | Motor relacional robusto que asegura el cumplimiento estricto de las propiedades ACID en transacciones monetarias. |
| **Contenerización** | Docker | Orquestación e infraestructura para empaquetar de forma aislada e independiente el motor SQL y los servidores locales. |
| **Herramientas de Entorno**| VS Code, Git, Postman, Git Bash | Herramientas utilizadas para codificación, control de versiones, simulación e interceptación de endpoints HTTP. |

---

## Estructura del Proyecto

El repositorio se encuentra estrictamente dividido en dos componentes de software independientes para respetar el diseño desacoplado:

```text
DashPoint/
├── backend/                       # Servidor de la API REST e infraestructura SQL
│   ├── src/
│   │   ├── config/                # Módulos de configuración (Conexión de BD)
│   │   │   └── db.js
│   │   ├── controllers/           # Lógica de control y consultas operativas
│   │   │   ├── proveedores.controller.js
│   │   │   ├── productos.controller.js
│   │   │   └── ventas.controller.js
│   │   ├── routes/                # Definición de rutas y endpoints de la API
│   │   │   ├── proveedores.routes.js
│   │   │   ├── productos.routes.js
│   │   │   └── ventas.routes.js
│   │   └── app.js                 # Inicialización de Express y middlewares
│   ├── index.js                   # Punto de entrada de ejecución del servidor
│   └── .env                       # Archivo de variables de entorno (Credenciales)
│
└── frontend/                      # Aplicación del lado del cliente (Interfaz UI)
    ├── src/
    │   ├── components/            # Elementos visuales reutilizables de la interfaz
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/               # Estado global de seguridad del sistema
    │   │   └── AuthContext.jsx
    │   ├── pages/                 # Pantallas principales del flujo de navegación
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Usuarios.jsx
    │   │   ├── Productos.jsx
    │   │   ├── Ventas.jsx
    │   │   └── Inventario.jsx
    │   ├── services/              # Consumo e integración con la API Backend
    │   │   └── api.js
    │   ├── App.jsx                # Enrutador y estructura base de la UI
    │   └── main.jsx               # Renderizado inicial en el DOM