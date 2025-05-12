import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ticket } from "./ticketTypes";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { es } from "date-fns/locale";

enum EstadoTicketSoporte {
  NUEVO = "NUEVO",
  ABIERTA = "ABIERTA",
  EN_PROCESO = "EN_PROCESO",
  PENDIENTE = "PENDIENTE",
  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",
  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",
  RESUELTA = "RESUELTA",
  CANCELADA = "CANCELADA",
  ARCHIVADA = "ARCHIVADA",
}

export function TicketItem({
  ticket,
  isSelected,
  onSelect,
  colorMap,
}: {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (t: Ticket) => void;
  colorMap: Record<number, string>;
}) {
  const color = colorMap[ticket.id] || "bg-gray-200";

  const getBadgeProps = (status: EstadoTicketSoporte) => {
    switch (status) {
      case EstadoTicketSoporte.NUEVO:
        return {
          text: "Nuevo",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        };
      case EstadoTicketSoporte.ABIERTA:
        return {
          text: "Abierto",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-600",
        };
      case EstadoTicketSoporte.EN_PROCESO:
        return {
          text: "En Proceso",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case EstadoTicketSoporte.PENDIENTE:
        return {
          text: "Pendiente",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
        };
      case EstadoTicketSoporte.PENDIENTE_CLIENTE:
        return {
          text: "Pendiente Cliente",
          bgColor: "bg-pink-50",
          textColor: "text-pink-600",
        };
      case EstadoTicketSoporte.PENDIENTE_TECNICO:
        return {
          text: "Pendiente Técnico",
          bgColor: "bg-teal-50",
          textColor: "text-teal-600",
        };
      case EstadoTicketSoporte.RESUELTA:
        return {
          text: "Resuelta",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case EstadoTicketSoporte.CANCELADA:
        return {
          text: "Cancelada",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
        };
      case EstadoTicketSoporte.ARCHIVADA:
        return {
          text: "Archivada",
          bgColor: "bg-gray-200",
          textColor: "text-gray-600",
        };
      default:
        return {
          text: "Desconocido",
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
        };
    }
  };

  return (
    <motion.div
      key={ticket.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`border-b p-4 cursor-pointer flex items-start gap-3 ${
        isSelected ? "bg-gray-100 dark:bg-gray-900" : ""
      }`}
      onClick={() => onSelect(ticket)}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className={`${color} text-gray-800 font-semibold`}>
          {(ticket.customer?.name.slice(0, 2) || "NA").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 text-[13px]">
          <span>
            #${ticket.id} · {ticket.customer?.name || "No asignado"}
          </span>
          <span className="text-xs">
            {format(new Date(ticket.date), "d MMM yyyy", { locale: es })}
          </span>
        </div>
        <h3 className="font-normal text-base truncate">{ticket.title}</h3>
        <p className="text-[12px] line-clamp-2">{ticket.description}</p>
      </div>
      <Badge
        variant="outline"
        className={`${colorMap[ticket.id]} ${
          getBadgeProps(ticket.status).textColor
        }`}
      >
        <span className="text-[10px]">{ticket.status}</span>
      </Badge>
    </motion.div>
  );
}
