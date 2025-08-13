import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { CajaAbierta, CerrarCaja, IniciarCaja } from "./interfaces";
import { motion } from "framer-motion";
import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import CajaForm from "./CajaForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrosCaja from "./RegistrosCaja";
import { toast } from "sonner";
import {
  cerrarCaja,
  getMovimientosCajaById,
  getUltimaCajaAbierta,
  getUltimoSaldoSucursal,
  getVentasCajaById,
  iniciarCaja,
} from "./api";
import { useStore } from "@/components/Context/ContextSucursal";
import { MovimientoCajaItem } from "./MovimientosCajaInterface";
import MovimientoCajaPage from "./Movimientos/movimiento-caja-page";
import { VentaLigadaACaja } from "./VentasCaja/interface";
function Caja() {
  const sucursalID: number = useStore((state) => state.sucursalId) ?? 0;
  const userID: number = useStore((state) => state.userId) ?? 0;
  const [cajaAbierta, setCajaAbierta] = useState<CajaAbierta | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const [movimientos, setMovimientos] = useState<MovimientoCajaItem[]>([]);

  const [ventas, setVentas] = useState<VentaLigadaACaja[]>([]);

  const [cajaMontoAnterior, setCajaMontoAnterior] = useState<number>(1);
  const [nuevaCaja, setNuevaCaja] = useState<IniciarCaja | null>({
    saldoInicial: cajaMontoAnterior,
    sucursalId: sucursalID,
    usuarioInicioId: userID,
    comentario: "",
  });
  const [cerrarCajaDto, setCerrarCajaDto] = useState<CerrarCaja | null>({
    cajaID: cajaAbierta?.id ?? 0,
    usuarioCierra: userID,
    comentarioFinal: "",
  });

  //STATES PARA ABRIR O CERRAR DIALOGS
  const [openConfirmDialog, setOpenConfirDialog] = useState<boolean>(false);
  const [openCloseCaja, setOpenCloseCaja] = useState<boolean>(false);

  let hasOpen: boolean = true;

  hasOpen = !!cajaAbierta && cajaAbierta.estado === "ABIERTO";
  useEffect(() => {
    if (hasOpen) {
      setNuevaCaja(null);
      setCerrarCajaDto((prev) => ({
        ...(prev ?? ({} as CerrarCaja)),
        cajaID: cajaAbierta?.id ?? 0,
        usuarioCierra: userID,
        comentarioFinal: "",
      }));
    } else {
      // Modo ABRIR: limpiamos cerrarCajaDto y preparamos nuevaCaja
      setCerrarCajaDto(null);
      setNuevaCaja({
        saldoInicial: cajaMontoAnterior,
        sucursalId: sucursalID,
        usuarioInicioId: userID,
        comentario: "",
      });
    }
  }, [hasOpen, cajaMontoAnterior, sucursalID, userID]);

  useEffect(() => {
    getCajaAbierta();
    getMontoAnterior();
  }, []);

  const handleChangeGeneric = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!nuevaCaja) return; // solo en modo ABRIR
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") return;
    setNuevaCaja({
      ...nuevaCaja,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    });
  };

  const handleChangeCerrar = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!cerrarCajaDto) return; // solo en modo CERRAR
    const { name, value, type } = e.target as HTMLInputElement;
    setCerrarCajaDto({
      ...cerrarCajaDto,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    });
  };

  const handleSubmitIniciarCaja = async () => {
    if (!nuevaCaja || isSubmiting) return;
    setIsSubmiting(true);
    try {
      await toast.promise(iniciarCaja(nuevaCaja), {
        loading: "Iniciando turno en caja...",
        success: "Turno registrado",
        error: "Error al registrar turno en caja",
      });
      await reloadContext();
    } finally {
      setIsSubmiting(false);
      setOpenConfirDialog(false);
      await reloadContext();
    }
  };

  const handleCerrarCaja = async () => {
    if (!cerrarCajaDto || isSubmiting) return;
    setIsSubmiting(true);
    try {
      await toast.promise(cerrarCaja(cerrarCajaDto), {
        loading: "Cerrando turno en caja...",
        success: "Caja cerrada correctamente",
        error: "Error al cerrar turno en caja",
      });
      await reloadContext(); // <- esto decide si limpia o trae todo
    } finally {
      setIsSubmiting(false);
      setOpenCloseCaja(false);
      await reloadContext();
    }
  };

  const getCajaAbierta = async () => {
    try {
      const data = await getUltimaCajaAbierta(sucursalID, userID);
      setCajaAbierta(data);
      return data;
    } catch {
      toast.error("Error al conseguir último registro de caja");
      return null;
    }
  };

  const getMontoAnterior = async () => {
    try {
      const data = await getUltimoSaldoSucursal(sucursalID);
      setCajaMontoAnterior(data);
    } catch {
      toast.error("Error al conseguir último monto de caja");
    }
  };

  const getMovimientosCaja = async (cajaId: number) => {
    try {
      const data = await getMovimientosCajaById(cajaId);
      setMovimientos(data);
    } catch {
      toast.error("Error al conseguir registros de movimientos de esta caja");
    }
  };
  const getVentasCaja = async (cajaId: number) => {
    try {
      const data = await getVentasCajaById(cajaId);
      setVentas(data);
    } catch {
      toast.error("Error al conseguir registros de ventas de esta caja");
    }
  };

  useEffect(() => {
    if (!cajaAbierta?.id) {
      setMovimientos([]);
      setVentas([]);
      return;
    }
    getMovimientosCaja(cajaAbierta.id);
    getVentasCaja(cajaAbierta.id);
  }, [cajaAbierta?.id]);

  const refreshMovimientos = useCallback(async () => {
    if (cajaAbierta?.id) {
      await getMovimientosCaja(cajaAbierta.id);
    } else {
      setMovimientos([]);
    }
  }, [cajaAbierta?.id]);

  const reloadContext = useCallback(async () => {
    const caja = await getUltimaCajaAbierta(sucursalID, userID);
    setCajaAbierta(caja);

    if (caja?.id) {
      const [movs, vtas] = await Promise.all([
        getMovimientosCajaById(caja.id),
        getVentasCajaById(caja.id),
      ]);
      setMovimientos(movs);
      setVentas(vtas);
    } else {
      setMovimientos([]);
      setVentas([]);
    }

    const saldo = await getUltimoSaldoSucursal(sucursalID);
    setCajaMontoAnterior(saldo);
  }, [sucursalID, userID]);

  useEffect(() => {
    reloadContext();
  }, [reloadContext]);

  return (
    <div className="container mx-auto">
      <motion.div {...DesvanecerHaciaArriba} className="w-full">
        <Tabs className="w-full" defaultValue="registrarcaja">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto p-1">
            <TabsTrigger
              value="registrarcaja"
              className="w-full text-sm md:text-sm  data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <span className="truncate">Registrar Caja</span>
            </TabsTrigger>
            <TabsTrigger
              value="movimientoscaja"
              className="w-full text-sm md:text-sm  data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <span className="truncate">Registrar Movimientos de Caja</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="registrarcaja" className="mt-6">
            <motion.div {...DesvanecerHaciaArriba}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="">
                  <CajaForm
                    // modo
                    hasOpen={hasOpen}
                    // abrir
                    nuevaCaja={nuevaCaja}
                    handleChangeGeneric={handleChangeGeneric}
                    handleSubmitIniciarCaja={handleSubmitIniciarCaja}
                    // cerrar
                    cerrarCajaDto={cerrarCajaDto}
                    handleChangeCerrar={handleChangeCerrar}
                    handleCerrarCaja={handleCerrarCaja}
                    // ui
                    isSubmiting={isSubmiting}
                    cajaMontoAnterior={cajaMontoAnterior}
                    openCloseCaja={openCloseCaja}
                    openConfirmDialog={openConfirmDialog}
                    setOpenCloseCaja={setOpenCloseCaja}
                    setOpenConfirDialog={setOpenConfirDialog}
                    cajaAbierta={cajaAbierta}
                  />
                </div>
                <div className="">
                  <RegistrosCaja ventas={ventas} movimientos={movimientos} />
                </div>
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="movimientoscaja" className="mt-6">
            <MovimientoCajaPage
              reloadContext={reloadContext}
              userID={userID}
              getMovimientosCaja={refreshMovimientos}
              getCajaAbierta={getCajaAbierta}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default Caja;
