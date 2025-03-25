import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { SocketProvider } from "./components/Context/SocketContext.tsx";
import { GoogleMapsProvider } from "./Crm/CrmRutas/CrmRutasCobro/GoogleMapsProvider .tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StrictMode>
      <SocketProvider>
        <GoogleMapsProvider>
          <App />
        </GoogleMapsProvider>
      </SocketProvider>
    </StrictMode>
  </ThemeProvider>
);
