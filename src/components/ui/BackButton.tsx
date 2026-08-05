import { useNavigate } from "react-router-dom";

export function BackButton({ fallback = "/", to }: { fallback?: string, to?: string }) {
	const navigate = useNavigate();

	const handleBack = () => {
		if (to) {
			navigate(to);
			return;
		}
		// React Router v6 stores the history index in window.history.state.idx
		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1);
		} else {
			navigate(fallback, { replace: true });
		}
	};

	return (
		<button
			className="flex items-center text-[40px] font-bold mb-12 cursor-pointer"
			onClick={handleBack}
		>
			<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
				<polyline points="15 18 9 12 15 6" />
			</svg>
			<h2 className="pl-4">Volver</h2>
		</button>
	);
}
