export type Tab = "favorites" | "history";

interface TabSelectorProps {
	activeTab: Tab;
	onTabChange: (tab: Tab) => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
	return (
		<div className="text-2xl mb-8 flex items-center gap-1">
			<span
				className={`cursor-pointer transition-all duration-200 ${activeTab === "favorites" ? "font-bold text-(--clr-primary-title)" : "font-normal text-(--clr-primary-title)/50 hover:text-(--clr-primary-title)/80"}`}
				onClick={() => onTabChange("favorites")}
			>
				Mi Lista
			</span>
			<span className="text-(--clr-primary-title)/30 mx-2">|</span>
			<span
				className={`cursor-pointer transition-all duration-200 ${activeTab === "history" ? "font-bold text-(--clr-primary-title)" : "font-normal text-(--clr-primary-title)/50 hover:text-(--clr-primary-title)/80"}`}
				onClick={() => onTabChange("history")}
			>
				Seguir viendo
			</span>
		</div>
	);
}
