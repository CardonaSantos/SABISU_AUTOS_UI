"use client"

const DesvanecerHaciaArriba = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default DesvanecerHaciaArriba
