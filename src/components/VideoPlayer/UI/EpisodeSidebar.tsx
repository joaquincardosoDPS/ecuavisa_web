import React, { useEffect, useRef } from "react";
import type { ProgramChapter } from "@/interfaces/vod";

interface EpisodeSidebarProps {
  episodes: ProgramChapter[];
  currentEpisodeKey?: string;
  visible: boolean;
  onClose: () => void;
  onCloseAll: () => void;
  onEpisodeSelect: (episode: ProgramChapter) => void;
}

interface EpisodeItemProps {
  episode: ProgramChapter;
  index: number;
  isCurrent: boolean;
  onSelect: (episode: ProgramChapter) => void;
  onClose: () => void;
  onCloseAll: () => void;
  currentEpisodeKey?: string;
}

const EpisodeItemComponent = ({ episode, index, isCurrent, onSelect, onClose, onCloseAll, currentEpisodeKey }: EpisodeItemProps) => {

  return (
    <div
      onClick={() => {
        if (episode.key !== currentEpisodeKey) onSelect(episode);
        else onCloseAll();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        cursor: "pointer",
        borderRadius: "8px",
        transition: "background-color 0.2s ease",
      }}
    >
      <span
        style={{
          color: isCurrent ? "#ff3c00" : "#fff",
          fontWeight: "bold",
          fontSize: "1.4rem",
          lineHeight: 1.3,
          flex: 1,
        }}
      >
        {episode.title}
      </span>
    </div>
  );
};

const EpisodeItem = React.memo(EpisodeItemComponent);

const EpisodeSidebarComponent = ({
  episodes = [],
  currentEpisodeKey,
  visible,
  onClose,
  onCloseAll,
  onEpisodeSelect,
}: EpisodeSidebarProps) => {

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible && episodes.length > 0) {
      const timer = setTimeout(() => {
        const currentIndex = episodes.findIndex((ep) => ep.key === currentEpisodeKey);
        const targetIndex = currentIndex >= 0 ? currentIndex : 0;

      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, episodes, currentEpisodeKey]);

  return (
    <>
      {/* Overlay Oscuro */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          opacity: visible ? 1 : 0,
          visibility: visible ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          zIndex: 2001,
        }}
      />

      {/* Contenedor del Sidebar */}
      <div
        ref={(node) => {
          sidebarRef.current = node;
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "350px",
          height: "100vh",
          backgroundColor: "transparent",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          zIndex: 2002,
          display: "block",
          padding: "32px 16px",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "50vh", paddingTop: "50vh" }}>
          {episodes.map((episode, index) => (
            <EpisodeItem
              key={episode.key || index}
              episode={episode}
              index={index}
              isCurrent={episode.key === currentEpisodeKey}
              onSelect={onEpisodeSelect}
              onClose={onClose}
              onCloseAll={onCloseAll}
              currentEpisodeKey={currentEpisodeKey}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export const EpisodeSidebar = React.memo(EpisodeSidebarComponent);
