import type { RefObject } from "react";

interface TabsSingleProps {
    showDetails: boolean;
    setShowDetails: (show: boolean) => void;
    tabsRef: RefObject<HTMLDivElement | null>;
    scrollToTabs: () => void;
}

function TabsSingle({
    showDetails,
    setShowDetails,
    tabsRef,
    scrollToTabs,
}: TabsSingleProps) {
    return (
        <div
            ref={tabsRef}
            className="mx-25 border-b-2 border-white/25 text-xl font-medium mt-10 scroll-mt-[94px]"
        >
            <div className="flex flex-row gap-10">
                <button
                    onClick={() => {
                        setShowDetails(false);
                        scrollToTabs();
                    }}
                    className={`pb-5 px-2 h-full cursor-pointer border-b-4 -mb-[2px] transition-colors ${!showDetails
                        ? "border-white text-white"
                        : "border-transparent text-(--clr-secondary-text) hover:text-white hover:border-white"
                        }`}
                >
                    Relacionados
                </button>
                <button
                    onClick={() => {
                        setShowDetails(true);
                        scrollToTabs();
                    }}
                    className={`pb-5 px-2 h-full cursor-pointer border-b-4 -mb-[2px] transition-colors ${showDetails
                        ? "border-white text-white"
                        : "border-transparent text-(--clr-secondary-text) hover:text-white hover:border-white"
                        }`}
                >
                    Detalles
                </button>
            </div>
        </div>
    );
}

export default TabsSingle;