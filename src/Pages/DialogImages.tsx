import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Asegúrate de tener este hook/componentes

interface PropsDialogs {
  images: string[];
  setOpenImage: (value: boolean) => void;
  openImage: boolean;
}

function DialogImages({ images, openImage, setOpenImage }: PropsDialogs) {
  // Hook de shadcn carousel para obtener el api y el estado
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Dialog open={openImage} onOpenChange={setOpenImage}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center mb-2">
            Imágenes relacionadas
          </DialogTitle>
        </DialogHeader>

        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center p-1">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`Imagen ${index + 1}`}
                    className="rounded-md object-cover max-h-[60vh] w-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <div className="flex justify-center mt-2">
          <p className="text-sm text-muted-foreground">
            {images.length > 0
              ? `Imagen ${current + 1} de ${count}`
              : "No hay imágenes disponibles"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogImages;
