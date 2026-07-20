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
}: TabsProps) {
  return (
    <div
      ref={tabsRef}
      className="text-xl font-medium scroll-mt-0 h-[15vh] flex flex-col justify-center"
    >
      <div className="flex flex-row items-center gap-6">
        {program.segments.map((segment, idx) => {
          const isActive = !showDetails && activeSegment?.id === segment.id;
          return (
            <div key={segment.key} className="flex items-center gap-6">
              {idx > 0 && <span className="w-px h-10 bg-(--clr-primary-title)" />}
              <button
                onClick={() => {
                  setActiveSegment(segment);
                  setShowDetails(false);
                  // requestScroll();
                }}
                className={`cursor-pointer transition-colors text-3xl ${isActive
                  ? "text-(--clr-primary-title) font-bold"
                  : "text-(--clr-primary-title)"
                  }`}
              >
                {segment.name}
              </button>
            </div>
          );
        })}
        <span className="w-px h-10 bg-(--clr-primary-title)" />
        <button
          onClick={() => {
            setShowDetails(true);
            // scrollToTabs();
          }}
          className={`cursor-pointer transition-colors text-3xl ${showDetails
            ? "text-(--clr-primary-title) font-bold"
            : "text-(--clr-primary-title)"
            }`}
        >
          Detalles
        </button>
      </div>
    </div>
  );
}

export default Tabs;
