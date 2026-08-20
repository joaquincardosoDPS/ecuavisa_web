import { useState } from "react";
import { FAQ_ITEMS } from "../constants";

interface FooterAccordionProps {
	className?: string;
}

export function FooterAccordion({ className = "" }: FooterAccordionProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleItem = (index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	};

	return (
		<div className={`w-full max-w-4xl mx-auto flex flex-col gap-3.5 ${className}`}>
			<div className="flex flex-col">
				{FAQ_ITEMS.map((item, index) => {
					const isOpen = openIndex === index;
					return (
						<div
							key={item.question}
							className="overflow-hidden transition-all duration-200 border-b border-[#666666]"
						>
							<button
								type="button"
								onClick={() => toggleItem(index)}
								className="w-full py-7 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
								aria-expanded={isOpen}
							>
								<span className="text-base md:text-lg font-normal text-(--clr-primary-title) group-hover:text-(--foc-primary) transition-colors duration-200 pr-4">
									{item.question}
								</span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={`text-(--clr-icon) shrink-0 transition-transform duration-300 ${
										isOpen ? "rotate-180 text-(--foc-primary)" : ""
									}`}
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</button>

							<div
								className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
									isOpen ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0 pb-0"
								}`}
							>
								<div className="overflow-hidden text-sm md:text-base text-[#7F98A5] leading-7 whitespace-pre-line">
									{item.answer}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default FooterAccordion;
