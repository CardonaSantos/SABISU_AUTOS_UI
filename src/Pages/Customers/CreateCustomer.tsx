import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = import.meta.env.VITE_API_URL;

// Define interface for cliente data
interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  dpi?: string; // Optional
  direccion?: string;
  actualizadoEn: string;
}

// Define form data structure
interface FormData {
  nombre: string;
  telefono?: string;
  direccion?: string;
  dpi?: string;
}

// Define form errors structure
interface FormErrors {
  nombre?: string;
  dpi?: string;
  telefono?: string;
}

export default function CreateCustomer() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    telefono: "",
    direccion: "",
    dpi: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Handle form input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (formData.dpi && !/^\d{13}$/.test(formData.dpi))
      newErrors.dpi = "El DPI debe tener 13 dígitos";
    if (formData.telefono && !/^\d{8}$/.test(formData.telefono))
      newErrors.telefono = "El teléfono debe tener 8 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${API_URL}/client`, formData);
        if (response.status === 201) {
          toast.success("Cliente creado");
          setFormData({
            nombre: "",
            telefono: "",
            direccion: "",
            dpi: "",
          });
        } else {
          throw new Error("Failed to create client");
        }
      } catch (error) {
        toast.error("Error al crear el cliente");
      }
    }
  };

  // Fetch clientes data from API
  const getCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/client/get-all-customers`);
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al conseguir clientes");
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  console.log("LOS CLIENTES SON: ", clientes);

  return (
    <Tabs defaultValue="crear-cliente" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="crear-cliente">Crear Cliente</TabsTrigger>
        <TabsTrigger value="clientes">Clientes</TabsTrigger>
      </TabsList>

      {/* Formulario para crear cliente */}
      <TabsContent value="crear-cliente">
        <Card>
          <CardHeader>
            <CardTitle>Crear Cliente</CardTitle>
            <CardDescription>
              Completa el siguiente formulario para añadir un nuevo cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Crear Nuevo Cliente
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? "border-destructive" : ""}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dpi">DPI (opcional)</Label>
                  <Input
                    id="dpi"
                    name="dpi"
                    value={formData.dpi}
                    onChange={handleChange}
                    className={errors.dpi ? "border-destructive" : ""}
                  />
                  {errors.dpi && (
                    <p className="text-sm text-destructive">{errors.dpi}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono (opcional)</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={errors.telefono ? "border-destructive" : ""}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-destructive">
                      {errors.telefono}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección (opcional)</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Crear Cliente
              </Button>
            </form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>

      {/* Tabla de clientes */}
      <TabsContent value="clientes">
        <Card>
          <CardHeader>
            <CardTitle>Clientes disponibles</CardTitle>
            <CardDescription>
              Visualiza y gestiona la información de los clientes existentes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              {/* Aquí puedes agregar una tabla */}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
