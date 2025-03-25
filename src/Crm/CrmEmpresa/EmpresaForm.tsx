import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle,
  CreditCard,
  Globe,
  Image,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from "lucide-react";
import axios from "axios";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { toast } from "sonner";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

const EmpresaForm = () => {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  // Estado para almacenar los datos de la empresa
  const [empresa, setEmpresa] = useState({
    // id: 0,
    nombre: "",
    direccion: "",
    telefono: "",
    pbx: "",
    correo: "",
    sitioWeb: "",
    nit: "",
    logo1: "",
    logo2: "",
    logo3: "",
  });

  // Estado para manejar si estamos en modo de creación o actualización
  const [isEditing, setIsEditing] = useState(false);

  // Función para hacer un GET para obtener la empresa
  const fetchEmpresa = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/empresa/${empresaId}`
      ); // Usando la constante VITE_API_CRM_URL
      const data = response.data;

      if (data) {
        setEmpresa(data);
        setIsEditing(true); // Si encontramos la empresa, pasamos al modo de edición
      }
    } catch (error) {
      console.error("Error al obtener la empresa:", error);
      // Si no encontramos una empresa, podemos crearla
      setIsEditing(false);
    }
  };

  console.log("La empresa es: ", empresa);

  // Función para manejar el envío de datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = isEditing ? "PATCH" : "POST"; // Si estamos editando, usamos PUT, sino POST
    const url = isEditing
      ? `${VITE_CRM_API_URL}/empresa/${empresaId}`
      : `${VITE_CRM_API_URL}/empresa`; // Asegúrate de usar el id si estás editando

    try {
      const response = await axios({
        method, // 'POST' o 'PUT'
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: empresa, // El cuerpo con los datos de la empresa
      });
      if (response.status === 200 || response.status === 201) {
        toast.info("ok");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos");
    }
  };

  // Llamar a fetchEmpresa cuando el componente se monta
  useEffect(() => {
    fetchEmpresa();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(setIsSubmitting);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white">
            {isEditing ? "Actualizar Empresa" : "Crear Empresa"}
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-3"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Información Principal */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-gray-800 dark:bg-gray-700 flex items-center justify-center text-white mr-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Información Principal
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-11">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="nombre"
                    type="text"
                    value={empresa.nombre}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nombre: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="direccion"
                    type="text"
                    value={empresa.direccion}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, direccion: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-gray-800 dark:bg-gray-700 flex items-center justify-center text-white mr-3">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Información de Contacto
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-11">
              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="telefono"
                    type="text"
                    value={empresa.telefono}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, telefono: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pbx"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  PBX
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneCall className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="pbx"
                    type="text"
                    value={empresa.pbx}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, pbx: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="correo"
                    type="email"
                    value={empresa.correo}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, correo: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="sitioWeb"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Sitio Web
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="sitioWeb"
                    type="url"
                    value={empresa.sitioWeb}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, sitioWeb: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Fiscal */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-gray-800 dark:bg-gray-700 flex items-center justify-center text-white mr-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Información Fiscal
              </h3>
            </div>

            <div className="pl-11">
              <div>
                <label
                  htmlFor="nit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  NIT
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="nit"
                    type="text"
                    value={empresa.nit}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nit: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logotipos */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-md bg-gray-800 dark:bg-gray-700 flex items-center justify-center text-white mr-3">
                <Image className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Logotipos
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-11">
              <div>
                <label
                  htmlFor="logo1"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Logo Principal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="logo1"
                    type="text"
                    value={empresa.logo1}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, logo1: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="logo2"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Logo Secundario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="logo2"
                    type="text"
                    value={empresa.logo2}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, logo2: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="logo3"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Logo Alternativo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="logo3"
                    type="text"
                    value={empresa.logo3}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, logo3: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-800 dark:focus:border-gray-400 transition-all duration-200 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pl-11">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden group w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-medium shadow-md border border-gray-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-busy={isSubmitting}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    {isEditing ? "Actualizar Empresa" : "Crear Empresa"}
                  </>
                )}
              </span>
              <span className="absolute bottom-0 left-0 h-1 bg-yellow-500 w-0 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EmpresaForm;
