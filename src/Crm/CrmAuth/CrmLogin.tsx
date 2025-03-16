"use client";

import type React from "react";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Lock } from "lucide-react";
import { toast } from "sonner";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function CrmLogin() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace with your actual login API endpoint
      const response = await axios.post(
        `${VITE_CRM_API_URL}/auth/login-user`,
        formData
      );

      console.log("Login successful:", response.data);

      if (response.status === 201) {
        toast.success("Inicio de sesión exitoso");
        localStorage.setItem("tokenAuthCRM", response.data.access_token);
        window.location.href = "/crm";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Acceso al CRM
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-10"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Sistema de gestión CRM © {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
