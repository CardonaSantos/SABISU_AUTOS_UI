import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const formatearFecha = (fecha: string) => {
  // Formateo en UTC sin conversión a local
  return dayjs(fecha).format("DD/MM/YYYY hh:mm A");
};

interface ticket {
  id: number;
  cliente: string;
  fechaTicket: string;
  ticketTexto: string;
}

interface myTicketsProps {
  tickets: ticket[];
}

function MyTickets({ tickets }: myTicketsProps) {
  return (
    <Card className=" w-full shadow-lg">
      <CardContent>
        <div className="flex justify-between items-center mb-2 ">
          <p className="font-semibold text-base my-2">Mis Tickets</p>
          <Link to={`tickets`} className="text-blue-600 text-sm font-medium">
            Ver todos
          </Link>
        </div>

        {/* Contenedor con scroll */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`p-3 shadow-md border-l-4 border-l-teal-500`}
            >
              <CardHeader className="p-0">
                <CardTitle>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-white">
                    <p className="truncate w-32">{ticket.cliente}</p>
                    <p>{formatearFecha(ticket.fechaTicket)}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-1">
                <p className="text-sm font-semibold text-black dark:text-white">
                  #{ticket.id} - {ticket.ticketTexto}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MyTickets;
