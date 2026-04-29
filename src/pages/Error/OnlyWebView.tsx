function OnlyWebView() {
  const handlePlayStore = () => {
    console.log("Ir a Play Store");
  };

  const handleAppStore = () => {
    console.log("Ir a App Store");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-(--clr-primary) px-5">
      <div className="w-full max-w-[400px] rounded-xl border border-(--clr-secondary) bg-(--clr-primary) p-8 text-center shadow-lg">
        <svg
          className="mx-auto mb-5 text-(--clr-icon)"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>

        <p className="text-(--clr-primary-text) text-base mb-6 leading-relaxed">
          Para una mejor experiencia descarga la app en App Store o Play Store.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePlayStore}
            className="w-full py-3 px-6 rounded-lg font-semibold text-base cursor-pointer bg-(--foc-primary) text-(--clr-text-primary-button) transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ir a Play Store
          </button>

          <button
            onClick={handleAppStore}
            className="w-full py-3 px-6 rounded-lg font-semibold text-base cursor-pointer bg-(--foc-primary) text-(--clr-text-primary-button) transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ir a App Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnlyWebView;
