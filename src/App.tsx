import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { Toaster } from "sonner";
import Dashboard from "./Pages/Dashboard";
import PuntoVenta from "./Pages/PuntoVenta";
import Inventario from "./Pages/Inventario";
import Clientes from "./Pages/Clientes";
import Reportes from "./Pages/Reportes";
import Productos from "./Pages/Productos";
import Proveedores from "./Pages/Proveedores";
import EntregasStock from "./Pages/EntregasStock";
import Devoluciones from "./Pages/Devoluciones";
import Vencimientos from "./Pages/Vencimientos";
import CategoriasDeProductos from "./Pages/CategoriasDeProductos";
import HistorialVentas from "./Pages/HistorialVentas";
import Notificaciones from "./Pages/Notificaciones";
import Stock from "./Pages/Stock";
import Invoice from "./components/PDF/Invoice";
import Login from "./Pages/Auth/Login";
import RegisterView from "./Pages/Auth/Register";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import NotFoundPage from "./Pages/NotFount/NotFoundPage";
import AgregarProveedor from "./Pages/Provider/AgregarProveedor";
import CreateCategory from "./Pages/Category/CreateCategory";
import CreateSucursal from "./Pages/Sucursal/CreateSucursal";
import ProductEditForm from "./Pages/Edit/EditProduct";
import Sucursales from "./Pages/Sucursal/Sucursales";

function App() {
  return (
    <>
      <Router>
        {/* Notificaciones */}
        <Toaster
          richColors
          expand={true}
          closeButton={true}
          position="top-right"
          duration={3000}
        />

        <Routes>
          {/* Redirecciona a dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterView />} />

          <Route path="*" element={<NotFoundPage />} />

          {/* Rutas no protegidas */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateUser />} /> */}

          {/* Rutas protegidas con Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/punto-venta"
              element={
                <ProtectedRoute>
                  <PuntoVenta />
                </ProtectedRoute>
              }
            />

            <Route
              path="/venta/generar-factura/:id"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-sucursal"
              element={
                <ProtectedRoute>
                  <CreateSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventario"
              element={
                <ProtectedRoute>
                  <Inventario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agregar-proveedor"
              element={
                <ProtectedRoute>
                  <AgregarProveedor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categorias"
              element={
                <ProtectedRoute>
                  <CreateCategory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/adicion-stock"
              element={
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clientes"
              element={
                <ProtectedRoute>
                  <Clientes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reportes"
              element={
                <ProtectedRoute>
                  <Reportes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <Productos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <Proveedores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/entregas-stock"
              element={
                <ProtectedRoute>
                  <EntregasStock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/devoluciones"
              element={
                <ProtectedRoute>
                  <Devoluciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vencimientos"
              element={
                <ProtectedRoute>
                  <Vencimientos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categorias-de-productos"
              element={
                <ProtectedRoute>
                  <CategoriasDeProductos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial/ventas"
              element={
                <ProtectedRoute>
                  <HistorialVentas />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notificaciones"
              element={
                <ProtectedRoute>
                  <Notificaciones />/{" "}
                </ProtectedRoute>
              }
            />

            <Route
              path="/editar-producto/:id"
              element={
                <ProtectedRoute>
                  <ProductEditForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sucursal"
              element={
                <ProtectedRoute>
                  <Sucursales />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
