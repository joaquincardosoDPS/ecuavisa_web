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
    "relative inline-flex items-center justify-center px-6 py-[0.8rem] border-2 border-transparent rounded-full text-[1.2rem] leading-[25.6px] tracking-[-0.02em] font-bold font-button cursor-pointer whitespace-nowrap transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
    primary: [
        'bg-(--clr-primary-title)/15 border-(--clr-primary-title)/20 text-(--clr-primary-title)',
        'hover:bg-(--clr-primary-button) hover:text-(--clr-text-primary-button) hover:border-transparent',
    ].join(' '),
    secondary: [
        'bg-(--clr-secondary-button) text-(--clr-text-secondary-button)',
        'hover:[box-shadow:0_0_20px_0_var(--foc-secondary)]',
    ].join(' '),
    tertiary: [
        'bg-transparent text-(--clr-text-tertiary-button) border-(--clr-text-tertiary-button)',
        'hover:bg-(--clr-text-tertiary-button) hover:text-(--clr-primary)',
        'hover:[box-shadow:0_0_10px_1px_var(--foc-tertiary)]',
    ].join(' '),
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
                    width="11.2"
                    height="12.8"
                    viewBox="0 0 14 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-[0.6rem] shrink-0 "
                >
                    <path d="M14 8L0 16V0L14 8Z" />
                </svg>
            )}
            {children}
        </button>
    );
}

export default Button;
