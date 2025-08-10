import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { EstadoGarantia } from "../types/dashboard";
import { TimeLineDto } from "./API/interfaces.interfaces";
import { AdvancedDialog } from "@/utils/components/AdvancedDialog";
import { useStore } from "@/components/Context/ContextSucursal";

interface PropsTimeline {
  setOpenTimeLine: React.Dispatch<React.SetStateAction<boolean>>;
  openTimeLine: boolean;
  garantiaID: number;
  handleCreateNewTimeLine: (dto: TimeLineDto) => Promise<void>;
}

const EstadoGarantiaConstants = [
  "RECIBIDO",
  "DIAGNOSTICO",
  "EN_REPARACION",
  "ESPERANDO_PIEZAS",
  "REPARADO",
  "REEMPLAZADO",
  "RECHAZADO_CLIENTE",
  "CANCELADO",
  "CERRADO",
] as const;

function CreateTimeLine({
  openTimeLine,
  setOpenTimeLine,
  garantiaID,
  handleCreateNewTimeLine,
}: PropsTimeline) {
  const userID = useStore((state) => state.userId) ?? 0;
  const [estado, setEstado] = useState<EstadoGarantia>(EstadoGarantia.RECIBIDO);
  const [conclusion, setConclusion] = useState("");
  const [accionesRealizadas, setAccionesRealizadas] = useState("");
  const [submitingRegist, setSubmitingRegist] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const data: TimeLineDto = {
    accionesRealizadas: accionesRealizadas,
    conclusion: conclusion,
    estado: estado,
    garantiaID: garantiaID,
    userID: userID,
  };

  const handleClearNewTimeline = () => {
    setConclusion("");
    setAccionesRealizadas("");
    setEstado(EstadoGarantia.RECIBIDO);
    setOpenTimeLine(false);
  };

  const isToClose: boolean = estado === EstadoGarantia.CERRADO ? true : false;

  return (
    <>
      <Dialog open={openTimeLine} onOpenChange={setOpenTimeLine}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Nuevo seguimiento de garantía
            </DialogTitle>
            <DialogDescription>
              Registra un nuevo estado en el historial de esta garantía.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={estado}
                onValueChange={(v) => setEstado(v as EstadoGarantia)}
              >
                <SelectTrigger id="estado" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estados disponibles</SelectLabel>
                    {EstadoGarantiaConstants.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e.replace(/_/g, " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conclusion">Conclusión</Label>
              <Textarea
                id="conclusion"
                placeholder="Describe la conclusión alcanzada"
                className="mt-1 w-full"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="acciones">Acciones realizadas</Label>
              <Textarea
                id="acciones"
                placeholder="Enumera las acciones llevadas a cabo"
                className="mt-1 w-full"
                value={accionesRealizadas}
                onChange={(e) => setAccionesRealizadas(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4 space-x-2">
            <Button
              className="w-full"
              variant={`${isToClose ? "outline" : "destructive"}`}
              onClick={() => setOpenTimeLine(false)}
            >
              Cancelar
            </Button>

            <Button
              variant={`${isToClose ? "destructive" : "outline"}`}
              className="w-full"
              onClick={() => {
                setOpenConfirmDialog(true);
              }}
            >
              {`${
                isToClose
                  ? "Cerrar registro de garantía"
                  : "Guardar registro de seguimiento"
              }`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdvancedDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        title={`${
          isToClose
            ? "Registrar cierre de seguimiento de garantía"
            : "Registrar nuevo seguimiento de garantía"
        }`}
        description={`${
          isToClose
            ? "Este será el ultimo registro en el historial de cambios de la garantía, se dará por cerrado y se quitará del dashboard"
            : "Este registro se añadirá al historial de cambios de garantia para su seguimiento y posterior consulta"
        }`}
        question={`${
          isToClose ? "Estás seguro de dar por terminado este registro?" : ""
        }`}
        confirmButton={{
          label: "Registrar cambio",
          disabled: submitingRegist,
          loading: submitingRegist,
          variant: "outline",
          onClick: async () => {
            setSubmitingRegist(true);
            // 1) Espera a que DashboardPageMain maneje el create + refresh
            await handleCreateNewTimeLine(data);
            // 2) Cierra diálogos y limpia formulario
            setSubmitingRegist(false);
            setOpenConfirmDialog(false);
            handleClearNewTimeline();
          },
        }}
        cancelButton={{
          label: "Cancelar",
          onClick: () => {
            setOpenTimeLine(false);
            setOpenConfirmDialog(false);
          },
          disabled: submitingRegist,
          variant: "destructive",
        }}
      />
    </>
  );
}

export default CreateTimeLine;
