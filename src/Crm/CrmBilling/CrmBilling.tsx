// import React from "react";
import { motion } from "framer-motion";
import BilingTable from "./BillingTable";

function Billing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full container px-2 py-1"
    >
      <h2 className="text-lg font-semibold mb-4 underline">Facturación</h2>
      <BilingTable />
    </motion.div>
  );
}

export default Billing;
