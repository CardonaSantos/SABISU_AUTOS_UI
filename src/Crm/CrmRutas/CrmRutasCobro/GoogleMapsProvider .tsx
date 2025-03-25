// lib/google-maps.ts
import { APIProvider } from "@vis.gl/react-google-maps";

export const GoogleMapsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <APIProvider apiKey="AIzaSyD_hzrV-YS5EaHDm-UK3jL0ny6gsJoj_18">
      {children}
    </APIProvider>
  );
};
