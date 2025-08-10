"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WarrantyCard } from "./warranty-card";
import CreateTimeLine from "./create-new-timeline";
import { TimeLineDto } from "./API/interfaces.interfaces";
import { EstadoGarantia, GarantiaType } from "../types/newGarantyTypes";

interface WarrantyCardListProps {
  warranties: GarantiaType[];
  formatearFecha: (fecha: string) => string;
  estadoColor: Record<EstadoGarantia, string>;
  toggleCard: (id: number) => void;
  expandedCard: number | null;
  setOpenUpdateWarranty: (open: boolean) => void;
  setSelectWarrantyUpdate: (garantia: GarantiaType | null) => void;
  setComentario: (value: string) => void;
  setDescripcionProblema: (value: string) => void;
  setEstado: (value: EstadoGarantia) => void;
  setProductoIdW: (id: number) => void;
  setWarrantyId: (id: number) => void;
  setOpenFinishWarranty: (open: boolean) => void;
  //open timeline

  openTimeLine: boolean;
  setOpenTimeLine: React.Dispatch<React.SetStateAction<boolean>>;
  warrantyId: number;
  handleCreateNewTimeLine: (dto: TimeLineDto) => Promise<void>;
}

export function WarrantyCardList({
  warranties,
  formatearFecha,
  estadoColor,
  toggleCard,
  expandedCard,
  setOpenUpdateWarranty,
  setSelectWarrantyUpdate,
  setComentario,
  setDescripcionProblema,
  setEstado,
  setProductoIdW,
  setWarrantyId,
  setOpenFinishWarranty,
  openTimeLine,
  setOpenTimeLine,
  warrantyId,
  handleCreateNewTimeLine,
}: WarrantyCardListProps) {
  return (
    <div className="space-y-4">
      {warranties && warranties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warranties.map((garantia) => (
            <WarrantyCard
              key={garantia.id}
              garantia={garantia}
              formatearFecha={formatearFecha}
              estadoColor={estadoColor}
              toggleCard={toggleCard}
              expandedCard={expandedCard}
              setOpenUpdateWarranty={setOpenUpdateWarranty}
              setSelectWarrantyUpdate={setSelectWarrantyUpdate}
              setComentario={setComentario}
              setDescripcionProblema={setDescripcionProblema}
              setEstado={setEstado}
              setProductoIdW={setProductoIdW}
              setWarrantyId={setWarrantyId}
              setOpenFinishWarranty={setOpenFinishWarranty}
              //timeline
              openTimeLine={openTimeLine}
              setOpenTimeLine={setOpenTimeLine}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Registros de garantía</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-base text-muted-foreground">
              No hay registros de garantía disponibles
            </p>
          </CardContent>
        </Card>
      )}
      <CreateTimeLine
        openTimeLine={openTimeLine}
        setOpenTimeLine={setOpenTimeLine}
        garantiaID={warrantyId}
        handleCreateNewTimeLine={handleCreateNewTimeLine}
      />
    </div>
  );
}
