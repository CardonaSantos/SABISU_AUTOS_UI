// components/ClientMap.tsx
"use client";

import {
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useEffect, useState, useRef } from "react";

interface Client {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  details: string;
}

const clients = [
  {
    id: 1,
    name: "Cliente Guatemala City",
    location: { lat: 15.667771183708325, lng: -91.71079631651628 },
    details: "Dirección: 5a calle 10-50, Zona 1\nTeléfono: 1234-5678",
  },
  {
    id: 2,
    name: "Cliente Antigua",
    location: { lat: 15.664518380454727, lng: -91.70734114964544 },
    details: "Dirección: 3a avenida norte #15\nTeléfono: 8765-4321",
  },

  {
    id: 3,
    name: "Sasha C-m",
    location: { lat: 15.681965909486406, lng: -91.70445879153229 },
    details: "Dirección: 5a calle 10-50, Zona 1\nTeléfono: 1234-5678",
  },

  {
    id: 3,
    name: "Sasha C-m",
    location: { lat: 15.681965909486406, lng: -91.70445879153229 },
    details: "Dirección: 3a avenida norte #15\nTeléfono: 8765-4321",
  },

  {
    id: 4,
    name: "Gym San Marcos",
    location: { lat: 15.676120419821737, lng: -91.70545792970417 },
    details: "Dirección: 5a calle 10-50, Zona 1\nTeléfono: 1234-5678",
  },

  {
    id: 5,
    name: "Otro cliente",
    location: { lat: 15.677781018538266, lng: -91.70785767394739 },
    details: "Dirección: 3a avenida norte #15\nTeléfono: 8765-4321",
  },

  {
    id: 6,
    name: "Julio Alberto",
    location: { lat: 15.677781018538266, lng: -91.70785767394739 },
    details: "Dirección: 5a calle 10-50, Zona 1\nTeléfono: 1234-5678",
  },

  {
    id: 7,
    name: "Mari Mileidy",
    location: { lat: 15.666435374081479, lng: -91.71017367140114 },
    details: "Dirección: 3a avenida norte #15\nTeléfono: 8765-4321",
  },
];

const Maps = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Crear la polyline
    polylineRef.current = new google.maps.Polyline({
      path: clients.map((c) => c.location),
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
  }, [map, mapLoaded]);

  useEffect(() => {
    if (map) setMapLoaded(true);
  }, [map]);

  return (
    <Map
      mapId="e209b83095802909" // Reemplazar con tu Map ID real
      defaultZoom={16}
      defaultCenter={{ lat: 15.666148, lng: -91.709069 }}
      gestureHandling="greedy"
      className="w-full h-full" // Aquí cambiamos h-[600px] por h-full
    >
      {mapLoaded &&
        clients.map((client) => (
          <AdvancedMarker
            key={client.id}
            position={client.location}
            onClick={() => {
              console.log("Cliente:", client);
              setSelectedClient(client);
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {client.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rotate-45"></div>
            </div>
          </AdvancedMarker>
        ))}

      {selectedClient && (
        <InfoWindow
          position={selectedClient.location}
          onCloseClick={() => {
            setSelectedClient(null);
          }}
        >
          <p className="p-2">
            <h2>{selectedClient.name}</h2>
            <p>{selectedClient.details}</p>
          </p>
        </InfoWindow>
      )}
    </Map>
  );
};

export default Maps;
