import type { RefObject } from "react";
import type { Program, Segment } from "@/interfaces/catalog.interface";

interface TabsProps {
  program: Program;
  activeSegment: Segment | null;
  setActiveSegment: (segment: Segment) => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  tabsRef: RefObject<HTMLDivElement | null>;
  scrollToTabs: () => void;
  requestScroll: () => void;
}

function Tabs({
  program,
  activeSegment,
  setActiveSegment,
  showDetails,
  setShowDetails,
  tabsRef,
  scrollToTabs,
  requestScroll,
}: TabsProps) {
  return (
    <div
      ref={tabsRef}
      className="mx-25 border-b-2 border-white/25 text-xl font-medium mt-10 scroll-mt-[94px]"
    >
      <div className="flex flex-row gap-10">
        {program.segments.map((segment) => {
          const isActive = !showDetails && activeSegment?.id === segment.id;
          return (
            <button
              key={segment.key}
              onClick={() => {
                setActiveSegment(segment);
                setShowDetails(false);
                requestScroll();
              }}
              className={`pb-5 px-2 h-full cursor-pointer border-b-4 -mb-[2px] transition-colors ${isActive
                ? "border-white text-white"
                : "border-transparent text-(--clr-secondary-text) hover:text-white hover:border-white"
                }`}
            >
              {segment.name}
            </button>
          );
        })}
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

export default Tabs;
