interface FavoriteButtonProps {
    isFavorited: boolean;
    isToggling: boolean;
    onClick: () => void;
}

function FavoriteButton({ isFavorited, isToggling, onClick }: FavoriteButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isToggling}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all shadow-lg cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited
                ? "bg-(--clr-primary-title) border-(--clr-primary-title) text-black hover:bg-white/80"
                : "bg-black/40 border-(--clr-primary-title) text-(--clr-primary-title) hover:bg-(--clr-primary-title) hover:text-black hover:border-(--clr-primary-title)"
                }`}
            aria-label={isFavorited ? "Quitar de Mi Lista" : "Agregar a Mi Lista"}
        >
            {isFavorited ? (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 transition-colors"
                >
                    <path d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 transition-colors"
                >
                    <path d="M12 4v16m8-8H4" />
                </svg>
            )}
        </button>
    );
}

export default FavoriteButton;
