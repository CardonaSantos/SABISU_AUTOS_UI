import { ChangeEvent, useEffect, useState } from "react";

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
  iniciarCaja,
} from "./api";
import { useStore } from "@/components/Context/ContextSucursal";
import { MovimientoCajaItem } from "./MovimientosCajaInterface";
import MovimientoCajaPage from "./Movimientos/movimiento-caja-page";
function Caja() {
  const sucursalID: number = useStore((state) => state.sucursalId) ?? 0;
  const userID: number = useStore((state) => state.userId) ?? 0;
  const [cajaAbierta, setCajaAbierta] = useState<CajaAbierta | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const [movimientos, setMovimientos] = useState<MovimientoCajaItem[]>([]);

  const [cajaMontoAnterior, setCajaMontoAnterior] = useState<number>(1);
  const [nuevaCaja, setNuevaCaja] = useState<IniciarCaja | null>({
    saldoInicial: cajaMontoAnterior,
    sucursalId: sucursalID,
    usuarioInicioId: userID,
    comentario: "",
  });
  const [cerrarCajaDto, setCerrarCajaDto] = useState<CerrarCaja | null>({
    saldoInicial: cajaAbierta?.saldoInicial ?? 0,
    sucursalId: sucursalID,
    usuarioInicioId: userID,
    comentarioFinal: "",
    cajaID: cajaAbierta?.id ?? 0,
    usuarioCierra: cajaAbierta?.usuarioInicioId ?? 0,
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
        // ajusta los campos según tu DTO
        ...(prev ?? ({} as CerrarCaja)),
        cajaID: cajaAbierta!.id,
        saldoFinal: 0, // default editable por el usuario
        // comentario: cajaAbierta?.comentario,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    try {
      if (!nuevaCaja || isSubmiting) return;
      setIsSubmiting(true);
      await toast.promise(iniciarCaja(nuevaCaja), {
        loading: "Iniciando turno en caja...",
        success: "Turno registrado",
        error: "Error al registrar turno en caja",
      });
      await getCajaAbierta(); // refresca modo
      await getMontoAnterior();
    } catch (error) {
      console.log("El error es:", error);
    } finally {
      setIsSubmiting(false);
      setOpenConfirDialog(false);
    }
  };

  const handleCerrarCaja = async () => {
    try {
      if (!cerrarCajaDto || isSubmiting) return;
      setIsSubmiting(true);
      await toast.promise(cerrarCaja(cerrarCajaDto), {
        loading: "Cerrando turno en caja...",
        success: "Caja cerrada correctamente",
        error: "Error al cerrar turno en caja",
      });
      await getCajaAbierta(); // al cerrar debería pasar a null
      await getMontoAnterior();
    } catch (error) {
      console.log("El error es: ", error);
      toast.error("Error al cerrar turno en caja");
    } finally {
      setIsSubmiting(false);
      setOpenCloseCaja(false);
    }
  };

  // 4) Fetchers (tal cual ya tenías)
  const getCajaAbierta = async () => {
    try {
      const data = await getUltimaCajaAbierta(sucursalID, userID);
      setCajaAbierta(data);
    } catch {
      toast.error("Error al conseguir último registro de caja");
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

  const getMovimientosCaja = async () => {
    try {
      if (!cajaAbierta) return;
      const data = await getMovimientosCajaById(cajaAbierta?.id);
      setMovimientos(data);
    } catch (error) {
      console.log("El error es: ", error);
      toast.error("Error al conseguir registros de movimientos de esta caja");
    }
  };

  useEffect(() => {
    if (!cajaAbierta?.id) return;
    getMovimientosCaja();
  }, [cajaAbierta?.id]);

  console.log("La caja a cerrar es: ", cerrarCajaDto);
  // const handleSuccess = () => {
  //   // Redirigir a la lista de movimientos o mostrar mensaje de

  //   alert("Registrado");
  //   console.log("Registrado");
  // };
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
                <RegistrosCaja movimientos={movimientos} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="movimientoscaja" className="mt-6">
            {/* <MovimientoForm usuarioId={1} onSuccess={handleSuccess} /> */}
            <MovimientoCajaPage />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default Caja;
