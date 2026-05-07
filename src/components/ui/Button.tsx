import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps {
    /** Texto visible del botón */
    children: React.ReactNode;
    /** Variante visual */
    variant?: ButtonVariant;
    /** Muestra una flecha de Play a la izquierda */
    showArrow?: boolean;
    /** Callback al hacer click */
    onClick?: () => void;
    /** Deshabilitado */
    disabled?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

const baseClasses =
    "relative inline-flex items-center justify-center px-10 py-3.5 border-2 border-transparent rounded-lg text-base font-bold font-inherit cursor-pointer whitespace-nowrap transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-[var(--clr-primary-button)] text-[var(--clr-text-primary-button)] hover:bg-white hover:text-black hover:shadow-[0_0_20px_4px_var(--clr-primary-button)]",
    secondary:
        "bg-[var(--clr-secondary-button)] text-[var(--clr-text-secondary-button)] hover:shadow-[0_0_20px_0px_#FF1A73]",
    tertiary:
        "bg-transparent text-[var(--clr-text-tertiary-button)] border-[var(--clr-text-tertiary-button)] hover:bg-[var(--clr-text-tertiary-button)] hover:text-black ",
};

function Button({
    children,
    variant = "primary",
    showArrow = false,
    onClick,
    disabled = false,
    className,
}: ButtonProps) {
    return (
        <button
            type="button"
            className={cn(baseClasses, variantClasses[variant], className)}
            onClick={onClick}
            disabled={disabled}
        >
            {showArrow && (
                <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3 shrink-0"
                >
                    <path d="M14 8L0 16V0L14 8Z" />
                </svg>
            )}
            {children}
        </button>
    );
}

export default Button;
