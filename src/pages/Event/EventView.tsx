import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvent";
import Banner from "./components/Banner";
import type { TabKey } from "./components/Tabs";
import Tabs from "./components/Tabs";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import EventsContainer from "./components/EventsContainer";
import DetailEvent from "./components/DetailEvent";

function EventView() {
    const { slug } = useParams<{ slug: string }>();
    const { event, events, isLoading } = useEvent(slug!);
    const [activeTab, setActiveTab] = useState<TabKey>("relacionados");

    if (isLoading) return <FullScreenSpinner />;

    console.log(event);
    return (
        <div className="w-full relative">
            <Banner event={event} />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mx-10 xl:mx-25 mt-10">
                {activeTab === "relacionados" && <EventsContainer events={events} />}
                {activeTab === "detalles" && event && <DetailEvent event={event} />}
            </div>
        </div>
    );
}

export default EventView;
