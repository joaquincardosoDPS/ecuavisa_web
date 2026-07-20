import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/event/useEvent";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import Banner from "./components/Banner";
import type { TabKey } from "./components/Tabs";
import Tabs from "./components/Tabs";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import EventsContainer from "./components/EventsContainer";
import DetailEvent from "./components/DetailEvent";

function EventView() {
    const { slug } = useParams<{ slug: string }>();
    const { event, events, isLoading } = useEvent(slug);
    useDocumentTitle(event?.title || slug);
    const [activeTab, setActiveTab] = useState<TabKey>("relacionados");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (isLoading) return <FullScreenSpinner />;

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
