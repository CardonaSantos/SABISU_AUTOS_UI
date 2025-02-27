// import React from "react";
import { motion } from "framer-motion";
import BilingTable from "./BillingTable";

function Billing() {
  return (
    <motion.div className="mx-auto p-4 container space-y-4">
      <h2 className="text-lg font-semibold underline">Facturación</h2>
      <BilingTable />
    </motion.div>
  );
}

export default Billing;
