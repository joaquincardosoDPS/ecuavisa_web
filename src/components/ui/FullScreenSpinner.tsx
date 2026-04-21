import { Spinner } from "./Spinner";

interface FullScreenSpinnerProps {
    message?: string;
}

export function FullScreenSpinner({ message = "Cargando..." }: FullScreenSpinnerProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--clr-primary)">
            <Spinner className="w-16 h-16 mb-6" />
            <p className="text-white font-title text-xl tracking-wider animate-pulse">
                {message}
            </p>
        </div>
    );
}
