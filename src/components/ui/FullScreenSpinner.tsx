import { Spinner } from "./Spinner";

export function FullScreenSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--clr-primary)">
            <Spinner className="w-16 h-16" />
        </div>
    );
}
