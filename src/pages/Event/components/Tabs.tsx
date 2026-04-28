import { useRef } from "react";

type TabKey = "relacionados" | "detalles";

interface TabsProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
}

function Tabs({ activeTab, setActiveTab }: TabsProps) {
    const tabsRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 50);
    };

    const tabClass = (isActive: boolean) =>
        `pb-5 px-2 h-full cursor-pointer border-b-4 -mb-[2px] transition-colors ${isActive
            ? "border-white text-white"
            : "border-transparent text-(--clr-secondary-text) hover:text-white hover:border-white"
        }`;

    return (
        <div
            ref={tabsRef}
            className="mx-10 xl:mx-25 border-b-2 border-white/25 text-xl font-medium mt-10 scroll-mt-[110px]"
        >
            <div className="flex flex-row gap-10">
                <button
                    onClick={() => {
                        setActiveTab("relacionados");
                        scrollToBottom();
                    }}
                    className={tabClass(activeTab === "relacionados")}
                >
                    Relacionados
                </button>
                <button
                    onClick={() => {
                        setActiveTab("detalles");
                        scrollToBottom();
                    }}
                    className={tabClass(activeTab === "detalles")}
                >
                    Detalles
                </button>
            </div>
        </div>
    );
}

export default Tabs;
export type { TabKey };