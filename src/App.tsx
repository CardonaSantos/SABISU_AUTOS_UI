import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PuntoVenta from "./Pages/PuntoVenta";
import Inventario from "./Pages/Inventario";
import Reportes from "./Pages/Reports/Reportes";
import EntregasStock from "./Pages/EntregasStock";
import Vencimientos from "./Pages/Vencimientos";
import HistorialVentas from "./Pages/HistorialVentas";
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
import TransferenciaProductos from "./Pages/Transferencia/TransferenciaProductos";
import TransferenciaProductosHistorial from "./Pages/Transferencia/TransferenciaHistorial";
import HistorialCambiosPrecio from "./Pages/HistorialPrecios/HistorialCambiosPrecio";
import StockEdicion from "./Pages/StockEdicion/StockEdicion";
import StockEliminaciones from "./Pages/Eliminaciones/StockEliminaciones";
import GarantiaPage from "./components/PDF/GarantiaPage";
import CreateCustomer from "./Pages/Customers/CreateCustomer";
import Layout2 from "./components/Layout/Layout2";
import TicketPage from "./components/PDF/TicketPage";
import TicketManage from "./Pages/TicketManage/TicketManage";
import ReceiveWarrantyPage from "./Pages/Warranty/ReceiveWarrantyPage";
import WarrantyPage from "./components/PDF/PDF-Warranty/WarrantyPage";
import WarrantyFinalPage from "./components/PDF/WarrantyFinal/WarrantyFinalPDFPage";
import RegistroDeposito from "./Pages/CashRegister/RegistroDeposito";
import RegistroCaja from "./Pages/CashRegister/RegistroCaja";
import CashRegisters from "./Pages/CashRegister/CashRegisters";
import BalanceSucursal from "./Pages/CashRegister/BalanceSucursal";
import UserConfig from "./Pages/Config/UserConfig";
import SalesDeleted from "./Pages/SalesDeleted/SalesDeleted";
import ClientHistorialPurchase from "./Pages/Client/ClientHistorialPurchase";
import CreatePlaceholder from "./Pages/VentaCuotas/CreatePlaceholder";
import CreateVentaCuotaForm from "./Pages/VentaCuotas/CreateVentaCuotas";
import ContratoCredito from "./Pages/VentaCuotas/ContratoCredito";
import EditPlaceHolder from "./Pages/VentaCuotas/EditPlaceHolder";

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
          <Route element={<Layout2 />}>
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
                // <ProtectedRoute>
                <CreateSucursal />
                // </ProtectedRoute>
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
              path="/reportes"
              element={
                <ProtectedRoute>
                  <Reportes />
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
              path="/vencimientos"
              element={
                <ProtectedRoute>
                  <Vencimientos />
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

            <Route
              path="/transferencia"
              element={
                <ProtectedRoute>
                  <TransferenciaProductos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transferencia-historial"
              element={
                <ProtectedRoute>
                  <TransferenciaProductosHistorial />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial-cambios-precio"
              element={
                <ProtectedRoute>
                  <HistorialCambiosPrecio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stock-edicion/:id"
              element={
                <ProtectedRoute>
                  <StockEdicion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stock-eliminaciones"
              element={
                <ProtectedRoute>
                  <StockEliminaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/garantía/generar-garantía/:id"
              element={
                <ProtectedRoute>
                  <GarantiaPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clientes-manage"
              element={
                <ProtectedRoute>
                  <CreateCustomer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket/generar-ticket/:id"
              element={
                <ProtectedRoute>
                  <TicketPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket/manage"
              element={
                <ProtectedRoute>
                  <TicketManage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket/manage"
              element={
                <ProtectedRoute>
                  <TicketManage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/garantia/manage"
              element={
                <ProtectedRoute>
                  <ReceiveWarrantyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ticket-garantia/:id"
              element={
                <ProtectedRoute>
                  <WarrantyPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/garantia/comprobante-uso/:id"
              element={
                <ProtectedRoute>
                  <WarrantyFinalPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/depositos-egresos/"
              element={
                <ProtectedRoute>
                  <RegistroDeposito />
                </ProtectedRoute>
              }
            />

            <Route
              path="/registro-caja"
              element={
                <ProtectedRoute>
                  <RegistroCaja />
                </ProtectedRoute>
              }
            />

            <Route
              path="/registros-caja"
              element={
                <ProtectedRoute>
                  <CashRegisters />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial/depositos-egresos"
              element={
                <ProtectedRoute>
                  <BalanceSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/config/user"
              element={
                <ProtectedRoute>
                  <UserConfig />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial/ventas-eliminaciones"
              element={
                <ProtectedRoute>
                  <SalesDeleted />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cliente-historial-compras/:id"
              element={
                <ProtectedRoute>
                  <ClientHistorialPurchase />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plantillas-venta-cuotas"
              element={
                <ProtectedRoute>
                  <CreatePlaceholder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/creditos"
              element={
                <ProtectedRoute>
                  <CreateVentaCuotaForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/imprimir/contrato/:recordId/:plantillaId"
              element={
                <ProtectedRoute>
                  <ContratoCredito />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit/plantilla/:id"
              element={
                <ProtectedRoute>
                  <EditPlaceHolder />
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
