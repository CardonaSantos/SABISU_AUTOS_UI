import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg mx-auto text-center bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className=" font-bold text-red-500">
            <h2 className="text-8xl">404</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">
            Oops, parece que no hay nada aquí
          </h2>
          <p className="text-gray-950 mb-8 pb-2 font-semibold">
            La página que buscas no existe.
          </p>
          <img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGl5Z2R1NGZ0dWFqZ3RrYWdtOG5qMmprZGYzcndnbW4zbGQyam9jcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DzQJvwh01gDYgUDoyc/giphy.gif"
            alt="Lost in Space"
            className="mx-auto mb-4"
            style={{ borderRadius: "8px" }}
          />
          <Button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            <Link to="/">Volver a Inicio</Link>
          </Button>
        </CardContent>
        <CardFooter className="text-gray-500 text-center">
          © {new Date().getFullYear()} Nova Sistemas
        </CardFooter>
      </Card>
    </div>
  );
}

export default NotFoundPage;
