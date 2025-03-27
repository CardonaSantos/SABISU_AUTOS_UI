"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  // Home,
  ImageIcon,
  MapPin,
  Phone,
  // User,
  UserIcon,
  UserRound,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  console.log("Los clientes son: ", clientes);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Crear la polyline
    // @ts-ignore
    polylineRef.current = new google.maps.Polyline({
      path: clientes.map((c) => c.location),
      geodesic: true,
      strokeColor: "#3B82F6",
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
    });

    // Limpiar al desmontar
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, mapLoaded, clientes]);

  useEffect(() => {
    if (map) setMapLoaded(true);
  }, [map]);

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
          {/* Pin punto */}
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-blue-600 -mt-[1px] shadow-sm"></div>
        </div>

        {/* Tooltip */}
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
        {/* Imagen y datos principales en una fila */}
        <div className="flex">
          {/* Carousel más pequeño */}
          <div className="w-1/3">
            {cliente.imagenes && cliente.imagenes.length > 0 ? (
              <Carousel className="w-full h-[100px]">
                <CarouselContent className="h-full">
                  {cliente.imagenes.map((img, index) => (
                    <CarouselItem key={index} className="h-full">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${cliente.nombreCompleto}`}
                        className="w-full h-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 w-5 h-5" />
                <CarouselNext className="right-1 w-5 h-5" />
              </Carousel>
            ) : (
              <div className="w-full h-[100px] flex items-center justify-center bg-gray-100">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información principal */}
          <div className="w-2/3 p-2">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {cliente.nombreCompleto}
            </h2>
            <p className="text-gray-600 text-xs line-clamp-1">
              {cliente.direccion}
            </p>

            <div className="flex items-center gap-2 mt-1 text-gray-700">
              <Phone className="h-3 w-3 text-blue-500" />
              <span className="text-xs">{cliente.telefono}</span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-gray-700">
              <UserIcon className="h-3 w-3 text-green-600" />
              <span className="text-xs">Cliente</span>
            </div>
          </div>
        </div>

        {/* Contacto de referencia */}
        <div className="px-2 py-1 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-xs text-gray-800">
              Contacto de referencia:
            </span>
            <span className="text-xs text-gray-700">
              {cliente.contactoReferencia.nombre}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-700">
            <Phone className="h-3 w-3 text-gray-500" />
            <span className="text-xs">
              {cliente.contactoReferencia.telefono}
            </span>
          </div>
        </div>

        {/* Footer: coordenadas y cerrar */}
        <div className="flex justify-between items-center px-2 py-1 bg-gray-50 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">
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
      {clientes.map((cliente) => (
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
