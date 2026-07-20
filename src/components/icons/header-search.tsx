import type { SVGProps } from 'react';

export function HeaderSearch(props: SVGProps<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
			<circle cx="10.5" cy="10.5" r="7.5" />
			<line x1="16" y1="16" x2="22" y2="22" />
		</svg>
	);
}
