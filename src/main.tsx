import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { SocketProvider } from "./components/Context/SocketContext.tsx";
import { GoogleMapsProvider } from "./Crm/CrmRutas/CrmRutasCobro/GoogleMapsProvider .tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryProvider } from "./Server/QueryProvider.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StrictMode>
      <SocketProvider>
        <GoogleMapsProvider>
          <QueryClientProvider client={queryClient}>
            <QueryProvider>
              <App />
            </QueryProvider>
          </QueryClientProvider>
        </GoogleMapsProvider>
      </SocketProvider>
    </StrictMode>
  </ThemeProvider>
);
