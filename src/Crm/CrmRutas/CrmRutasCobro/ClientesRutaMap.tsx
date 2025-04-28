"use client";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
import {
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  // Home,
  // ImageIcon,
  MapPin,
  Phone,
  // User,
  // UserIcon,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Ubicacion {
  lat: number;
  lng: number;
}

interface Factura {
  id: number;
  montoPago: number;
  estadoFactura: string;
  saldoPendiente: number;
  creadoEn: string;
  detalleFactura: string;
}

interface contactoReferencia {
  telefono: string;
  nombre: string;
}

interface Cliente {
  id: number;
  nombreCompleto: string;
  telefono: string;
  contactoReferencia: contactoReferencia;
  location: Ubicacion;
  direccion: string;
  imagenes: string[];
  facturas: Factura[];
}

interface PropsClientes {
  clientes: Cliente[];
}

const Maps = ({ clientes }: PropsClientes) => {
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const map = useMap();

  const isValidLocation = (location: Ubicacion) =>
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number" &&
    !isNaN(location.lat) &&
    !isNaN(location.lng) &&
    Math.abs(location.lat) <= 90 &&
    Math.abs(location.lng) <= 180;

  const validClientes = clientes.filter((c) => isValidLocation(c.location));

  useEffect(() => {
    if (!map || validClientes.length < 2) return;

    const service = new google.maps.DirectionsService();
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      suppressInfoWindows: true,
      preserveViewport: false,
      polylineOptions: {
        strokeColor: "#0802b0",
        strokeWeight: 4,
        strokeOpacity: 0.7,
      },
      map,
    });

    const waypoints = validClientes.slice(1, -1).map((c) => ({
      location: c.location,
      stopover: true,
    }));

    service.route(
      {
        origin: validClientes[0].location,
        destination: validClientes[validClientes.length - 1].location,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          renderer.setDirections(result);
        } else {
          console.error("Error en DirectionsService:", status);
        }
      }
    );

    return () => renderer.setMap(null);
  }, [map, validClientes]);

  const CustomMarker = ({ cliente }: { cliente: Cliente }) => {
    const todasPagadas = cliente.facturas.every(
      (factura) => factura.estadoFactura === "PAGADA"
    );

    return (
      <div className="relative group">
        <div className="flex flex-col items-center">
          <div
            className={`w-5 h-5 ${
              todasPagadas ? "bg-green-500" : "bg-red-500"
            } rounded-full flex items-center justify-center text-white shadow-md transform-gpu transition-transform group-hover:scale-110 z-10`}
          >
            <UserRound className="w-3 h-3" />
          </div>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-blue-600 -mt-[1px] shadow-sm"></div>
        </div>
        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 border border-gray-200 text-black">
          {cliente.nombreCompleto}
        </div>
      </div>
    );
  };

  const InfoContent = ({
    cliente,
    onClose,
  }: {
    cliente: Cliente;
    onClose: () => void;
  }) => {
    return (
      <div className="w-[350px] bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 text-xs">
        <div className="flex">
          <div className="w-full p-2">
            <h2 className="text-sm font-semibold text-gray-900">
              {cliente.nombreCompleto}
            </h2>
            <p className="text-gray-600 text-xs">{cliente.direccion}</p>

            <div className="flex items-center gap-2 mt-1 text-gray-700">
              <Phone className="h-3 w-3 text-blue-500" />
              <span>{cliente.telefono || "Sin teléfono registrado"}</span>
            </div>
          </div>
        </div>

        <div className="px-2 py-1 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-xs text-gray-800">
              Contacto de referencia:
            </span>
            <span className="text-xs text-gray-700">
              {cliente.contactoReferencia.nombre || "Sin nombre registrado"}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-700">
            <Phone className="h-3 w-3 text-gray-500" />
            <span>
              {cliente.contactoReferencia.telefono || "No registrado"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center px-2 py-1 bg-gray-50 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>
              {cliente.location.lat.toFixed(5)},{" "}
              {cliente.location.lng.toFixed(5)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  return (
    <Map
      mapId="e209b83095802909"
      defaultZoom={16}
      defaultCenter={{ lat: 15.666148, lng: -91.709069 }}
      className="w-full h-full"
    >
      {validClientes.map((cliente) => (
        <AdvancedMarker
          key={cliente.id}
          position={cliente.location}
          onClick={() => setSelectedClient(cliente)}
        >
          <CustomMarker cliente={cliente} />
        </AdvancedMarker>
      ))}

      {selectedClient && (
        <InfoWindow
          position={selectedClient.location}
          onCloseClick={() => setSelectedClient(null)}
        >
          <InfoContent
            cliente={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        </InfoWindow>
      )}
    </Map>
  );
};

export default Maps;
