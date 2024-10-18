import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

function CreateCategory() {
  const [nombre, setNombre] = useState<string>("");

  const submitCat = async () => {
    try {
      const response = await axios.post(`${API_URL}/categoria`, {
        nombre,
      });
      if (response.status === 201) {
        toast.success("Categoria creada");
        setNombre("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear categoria");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <Card className="w-full max-w-md mx-auto shadow-md rounded-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Añadir nueva categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full border rounded-md px-3 py-2"
            />
            <Button
              onClick={submitCat}
              className="w-full bg-blue-500  py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Crear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCategory;
