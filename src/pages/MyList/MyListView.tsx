import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useMyListData } from "@/hooks/mylist/useMyListData";
import { useHistoryData } from "@/hooks/history/useHistoryData";
import { TabSelector, type Tab } from "./components/TabSelector";
import { HistoryGrid } from "./components/HistoryGrid";
import EmptyList from "./components/EmptyList";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

function MyListView() {
	useDocumentTitle('Mi Lista');

	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<Tab>("favorites");

	const {
		favorites, isLoading: favLoading, isError: favError, error: favErr,
		isAuthenticated, fetchNextPage: favNext, hasNextPage: favHasNext, isFetchingNextPage: favFetching,
	} = useMyListData();

	const {
		historyItems, isLoading: histLoading, isError: histError, error: histErr,
		fetchNextPage: histNext, hasNextPage: histHasNext, isFetchingNextPage: histFetching,
	} = useHistoryData();

	const isLoading = activeTab === "favorites" ? favLoading : histLoading;
	const isError = activeTab === "favorites" ? favError : histError;
	const error = activeTab === "favorites" ? favErr : histErr;

	return (
		<div className="px-48 pt-24 | xs:max-md:px-7.5 xs:max-md:pt-7.5">
			<BackButton />
			<TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

			{!isAuthenticated ? (
				<div className="flex flex-col items-center justify-center py-20 gap-4 | xs:max-md:pt-0 xs:max-md:gap-8.5">
					<p className="text-(--clr-primary-title)/60 text-lg">
						Inicia sesión para ver {activeTab === "favorites" ? "tu lista de favoritos" : "tu historial"}.
					</p>
					<Button variant="secondary" onClick={() => navigate("/auth/login")}>
						Iniciar sesión
					</Button>
				</div>
			) : isLoading ? (
				<FullScreenSpinner />
			) : isError ? (
				<p className="text-red-500 text-center py-20">
					{error instanceof Error ? error.message : "Error al cargar contenido."}
				</p>
			) : activeTab === "favorites" ? (
				!favorites || favorites.length === 0 ? (
					<EmptyList />
				) : (
					<ProgramGrid
						programs={favorites}
						cols={5}
						fetchNextPage={favNext}
						hasNextPage={favHasNext}
						isFetchingNextPage={favFetching}
					/>
				)
			) : (
				<HistoryGrid
					items={historyItems}
					fetchNextPage={histNext}
					hasNextPage={histHasNext}
					isFetchingNextPage={histFetching}
				/>
			)}
		</div>
	);
}

export default MyListView;
