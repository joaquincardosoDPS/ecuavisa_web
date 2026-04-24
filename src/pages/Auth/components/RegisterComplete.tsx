import bgPrograms from "@/assets/img/bgPrograms.png";
import logo from "@/assets/img/logo.svg";
import { Spinner } from "@/components/ui/Spinner";

function RegisterComplete() {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-(--clr-primary)">
      {/* Fondo a la derecha */}
      <img
        src={bgPrograms}
        alt=""
        className="absolute right-0 top-0 h-full w-[50%] object-cover object-left pointer-events-none select-none"
      />

      {/* Contenido a la izquierda */}
      <div className="relative z-10 w-[50%] min-h-screen flex flex-col items-center justify-center px-12">
        <img src={logo} alt="" className="w-20 mb-10" />
        <h1 className="text-3xl text-(--foc-primary) mb-3">
          ¡Tu cuenta ha sido creada con éxito!
        </h1>
        <p className="text-(--clr-primary-title,#fff) mb-3">
          En breve podrás disfrutar nuestra aplicación
        </p>
        <Spinner />
      </div>
    </div>
  );
}

export default RegisterComplete;
