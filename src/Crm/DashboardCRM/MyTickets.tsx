import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyTickets() {
  const tickets = [
    {
      id: 1392,
      cliente: "Albertina Yadira",
      ticketTexto: "IR A RECOGER IP PARA SUSPENDER",
      fechaTicket: "20 Feb 2025 3:57 pm",
      color: "border-l-orange-500",
    },
    {
      id: 1397,
      cliente: "Juana Yadira",
      ticketTexto: "RECOGER EQUIPO Y QUE PAGUE 2 MESES QUE DEBE",
      fechaTicket: "21 Feb 2025 11:30 am",
      color: "border-l-blue-500",
    },
    {
      id: 1401,
      cliente: "Carlos Pérez",
      ticketTexto: "Problema con la velocidad del internet",
      fechaTicket: "22 Feb 2025 9:15 am",
      color: "border-l-green-500",
    },
    {
      id: 1405,
      cliente: "María López",
      ticketTexto: "Cambio de plan solicitado",
      fechaTicket: "23 Feb 2025 4:45 pm",
      color: "border-l-purple-500",
    },
  ];

  return (
    <Card className=" w-full shadow-lg">
      <CardContent>
        <div className="flex justify-between items-center mb-2 ">
          <p className="font-semibold text-base my-2">Mis Tickets</p>
          <a href="#" className="text-blue-600 text-sm font-medium">
            Ver todos
          </a>
        </div>

        {/* Contenedor con scroll */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`p-3 shadow-md border-l-4 ${ticket.color}`}
            >
              <CardHeader className="p-0">
                <CardTitle>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-white">
                    <p className="truncate w-32">{ticket.cliente}</p>
                    <p>{ticket.fechaTicket}</p>
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
