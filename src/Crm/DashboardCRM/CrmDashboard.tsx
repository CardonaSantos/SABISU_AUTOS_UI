import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserMinus,
  UserX,
  AlertCircle,
  Zap,
  ZapOff,
  WifiOff,
} from "lucide-react";
import DesvanecerHaciaArriba from "../Motion/DashboardAnimations";
import { motion } from "framer-motion";
import LightCardMotion from "../Motion/CardMotion";
import MyTickets from "./MyTickets";
import MorososInvoices from "./MorososInvoices";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
const tokencrm = localStorage.getItem("authTokenCRM");

export default function CrmDashboard() {
  console.log(tokencrm);
  const nombre = useStoreCrm((state) => state.nombre);
  console.log("nombre crm", nombre);
  return (
    <motion.div
      {...DesvanecerHaciaArriba}
      className="container mx-auto p-4 space-y-4"
    >
      <h1 className="text-lg font-bold md:text-3xl lg:text-4xl text-center underline">
        Nova Dashboard CRM
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Clientes Activos"
          value="1,234"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Clientes Morosos"
          value="56"
          icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Clientes Suspendidos"
          value="23"
          icon={<WifiOff className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Clientes Desconectados"
          value="23"
          icon={<UserX className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Clientes que no están en CRM"
          value="45"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />

        <StatCard
          title="Servicios Activos"
          value="2,345"
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Servicios Suspendidos"
          value="67"
          icon={<ZapOff className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="container mx-auto space-y-4">
        <MyTickets />
      </div>

      <div className="container mx-auto space-y-4">
        <MorososInvoices />
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div {...LightCardMotion}>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
