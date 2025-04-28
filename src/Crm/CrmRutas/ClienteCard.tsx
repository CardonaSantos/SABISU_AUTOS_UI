import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Phone, FileText } from "lucide-react";
import type { ClienteInternet, EstadoCliente } from "./rutas-types";

interface ClienteCardProps {
  cliente: ClienteInternet;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  getBadgeColor: (estado: EstadoCliente) => string;
}

export function ClienteCard({
  cliente,
  isSelected,
  onSelect,
  getBadgeColor,
}: ClienteCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 text-primary bg-primary/10">
                <AvatarFallback>
                  {cliente.nombre.charAt(0)}
                  {cliente.apellidos ? cliente.apellidos.charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium line-clamp-1">
                  {cliente.nombre} {cliente.apellidos || ""}
                </div>
                {cliente.telefono && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {cliente.telefono}
                  </div>
                )}
              </div>
            </div>
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          </div>

          {cliente.direccion && (
            <div className="flex items-start gap-2 mb-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground line-clamp-2">
                {cliente.direccion}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge className={getBadgeColor(cliente.estadoCliente)}>
              {cliente.estadoCliente}
            </Badge>
            <div className="text-right">
              <div className="font-medium">
                Q{cliente.saldoPendiente?.toFixed(2) || "0.00"}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                {cliente.facturasPendientes || 0} facturas
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
