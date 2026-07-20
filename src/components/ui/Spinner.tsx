interface SpinnerProps {
    className?: string;
}

export function Spinner({ className = "w-12 h-12" }: SpinnerProps) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Anillo exterior translúcido */}
            <div className="absolute inset-0 border-4 border-(--clr-primary-title)/20 rounded-full"></div>
            {/* Anillo principal giratorio con el color de foco */}
            <div className="absolute inset-0 border-4 border-(--foc-primary) rounded-full border-t-transparent animate-spin"></div>
        </div>
    );
}
