// import React from "react";
import { motion } from "framer-motion";
import DesvanecerHaciaArriba from "../Motion/DashboardAnimations";
import MyTable from "./CrmCustomerTable";

function CrmCustomers() {
  return (
    <motion.div
      {...DesvanecerHaciaArriba}
      className="container mx-auto p-4 space-y-4"
    >
      <h2 className="text-lg font-semibold underline">Clientes</h2>
      <MyTable />
    </motion.div>
  );
}

export default CrmCustomers;
