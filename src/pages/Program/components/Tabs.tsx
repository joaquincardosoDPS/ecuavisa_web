import type { RefObject } from "react";
import type { Program, Segment } from "@/interfaces/catalog.interface";

type ActiveTab = "details" | Segment;

interface TabsProps {
  program: Program;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tabsRef: RefObject<HTMLDivElement | null>;
  scrollToTabs: () => void;
}

function Tabs({
  program,
  activeTab,
  setActiveTab,
  tabsRef,
  scrollToTabs,
}: TabsProps) {

  const tabClass = (isActive: boolean) =>
    `pb-5 px-2 h-full cursor-pointer border-b-4 -mb-[2px] transition-colors ${isActive
      ? "border-(--clr-primary-title) text-(--clr-primary-title)"
      : "border-transparent text-(--clr-secondary-text) hover:text-(--clr-primary-title) hover:border-(--clr-primary-title)"
    }`;

  return (
    <div
      ref={tabsRef}
      className="mx-25 border-b-2 border-(--clr-primary-title)/25 text-xl font-medium mt-10 scroll-mt-23.5"
    >
      <div className="flex flex-row gap-10">
        {program.segments.map((segment) => {
          const isActive =
            typeof activeTab === "object" && activeTab.id === segment.id;
          return (
            <button
              key={segment.key}
              onClick={() => {
                setActiveTab(segment);
                scrollToTabs();
              }}
              className={tabClass(isActive)}
            >
              {segment.name}
            </button>
          );
        })}
        <button
          onClick={() => {
            setActiveTab("details");
            scrollToTabs();
          }}
          className={tabClass(activeTab === "details")}
        >
          Detalles
        </button>
      </div>
    </div>
  );
}

export default Tabs;
export type { ActiveTab };
