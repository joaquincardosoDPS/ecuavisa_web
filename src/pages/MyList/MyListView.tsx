import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/authStore";
import { favoritesService } from "@/services/favoritesService";
import EmptyList from "./components/EmptyList";

function MyListView() {
	const navigate = useNavigate();
	const token = useAuthStore((s) => s.token);
	const activeProfile = useAuthStore((s) => s.activeProfile);

	const {
		data: favorites,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["favorites", token, activeProfile?.id],
		queryFn: async () => {
			const response = await favoritesService.getAll(token!, activeProfile!.id);
			if (response.status === "error") {
				throw new Error(response.msj || "Error al cargar favoritos.");
			}
			return response.data || [];
		},
		enabled: !!token && !!activeProfile,
	});

	return (
		<div className="px-25 pt-10 min-h-[calc(100vh-84px)] | xs:max-md:px-7.5 xs:max-md:pt-7.5">
			<h1 className="text-3xl font-bold mb-8">Mi Lista</h1>

			{!token || !activeProfile ? (
				<div className="flex flex-col items-center justify-center py-20 gap-4 | xs:max-md:pt-0 xs:max-md:gap-8.5">
					<p className="text-white/60 text-lg">
						Inicia sesión para ver tu lista de favoritos.
					</p>
					<button
						onClick={() => navigate("/auth/login")}
						className="bg-(--foc-primary) text-(--clr-primary-text,#fff) px-6 py-3 rounded-md font-semibold hover:brightness-110 transition-all duration-200 cursor-pointer"
					>
						Iniciar sesión
					</button>
				</div>
			) : isLoading ? (
				<div className="flex justify-center py-20">
					<Spinner />
				</div>
			) : isError ? (
				<p className="text-red-500 text-center py-20">
					{error instanceof Error
						? error.message
						: "Error al cargar favoritos."}
				</p>
			) : !favorites || favorites.length === 0 ? (
				<EmptyList />
			) : (
				<ProgramGrid programs={favorites} />
			)}
		</div>
	);
}

export default MyListView;
