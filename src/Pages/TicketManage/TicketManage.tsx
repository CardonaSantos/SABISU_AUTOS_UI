import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

// Definición de tipos

// Componente principal
// Componente principal
export default function TicketManage() {
  const [ticketExist, setTicketsExist] = useState(false);
  const [ticketId, setTicketId] = useState<number | null>(null); // Almacena el ID del ticket existente
  const [descripcionSorteo, setDescripcionSorteo] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescripcionSorteo(e.target.value);
  };

  const handleSubmit = async () => {
    if (ticketExist && ticketId !== null) {
      // Si el ticket existe, actualizar
      try {
        const response = await axios.patch(`${API_URL}/ticket/${ticketId}`, {
          descripcionSorteo,
        });
        if (response.status === 200) {
          toast.success("Ticket de evento actualizado");
          getTicket(); // Recargar el ticket actualizado
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al actualizar el ticket de evento");
      }
    } else {
      // Si no existe, crear uno nuevo
      try {
        const response = await axios.post(`${API_URL}/ticket`, {
          descripcionSorteo,
        });
        if (response.status === 201) {
          toast.success("Ticket de evento creado");
          getTicket(); // Recargar el ticket creado
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al crear el ticket de evento");
      }
    }
  };

  // const handleDelete = async () => {
  //   if (ticketId !== null) {
  //     try {
  //       const response = await axios.delete(`${API_URL}/ticket/${ticketId}`);
  //       if (response.status === 200) {
  //         toast.success("Ticket de evento eliminado");
  //         setDescripcionSorteo("");
  //         setTicketsExist(false);
  //         setTicketId(null);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Error al eliminar el ticket de evento");
  //     }
  //   }
  // };

  const getTicket = async () => {
    try {
      const response = await axios.get(`${API_URL}/ticket`);
      if (response.status === 200 && response.data.length > 0) {
        const ticket = response.data[0];
        setTicketId(ticket.id);
        setDescripcionSorteo(ticket.descripcionSorteo);
        setTicketsExist(true);
      } else {
        setTicketId(null);
        setDescripcionSorteo("");
        setTicketsExist(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener el ticket");
    }
  };

  useEffect(() => {
    getTicket();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {ticketExist ? "Editar Ticket Sorteo" : "Crear Ticket Sorteo"}
          </CardTitle>
          <CardDescription>
            {ticketExist
              ? "Edite la descripción del sorteo"
              : "Ingrese la descripción del nuevo sorteo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="descripcionSorteo">
                  Descripción del Sorteo
                </Label>
                <Textarea
                  id="descripcionSorteo"
                  name="descripcionSorteo"
                  value={descripcionSorteo}
                  onChange={handleInputChange}
                  placeholder="Ingrese la descripción del sorteo"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>
            {ticketExist ? "Actualizar" : "Crear"} Ticket Sorteo
          </Button>
          {/* {ticketExist && (
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar Ticket
            </Button>
          )} */}
        </CardFooter>
      </Card>
    </div>
  );
}
