import { EpisodeSidebar } from "./EpisodeSidebar";
import { Seekbar } from "./Seekbar";
import type { ProgramChapter } from "@/interfaces/vod";

import iconosReiniciar from "@/assets/img/icons/iconos-reiniciar.svg";
import iconosFila from "@/assets/img/icons/iconos-fila.svg";
import iconosConfig from "@/assets/img/icons/iconos-config.svg";
import iconosPlay from "@/assets/img/icons/iconos-play.svg";
import iconosPause from "@/assets/img/icons/iconos-pause.svg";
import { useEffect, useState } from "react";
import React from "react";

// ---- Botón de Opciones ----
interface PlayerOptionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

export const PlayerOptionButton = ({
  icon,
  onClick,
}: PlayerOptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.6)",
        backgroundColor: "transparent",
        color: "#fff",
        transition: "all 0.2s ease",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        outline: "none",
        padding: 0,
        boxShadow: "none",
      }}
    >
      {icon}
    </button>
  );
};

// ---- Botón de Calidad Dinámico ----
interface QualityOptionProps {
  label: string;
  onSelect: () => void;
  onClose: () => void;
}

const QualityOption = ({ label, onSelect }: QualityOptionProps) => {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: "8px 16px",
        color: "#fff",
        backgroundColor: "transparent",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

interface PlayerQualityButtonProps {
  value?: string;
  qualities: { value: string; label: string }[];
  onChange?: (val: string) => void;
}

export const PlayerQualityButton = ({
  value = "auto",
  qualities,
  onChange,
}: PlayerQualityButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: string) => {
    if (onChange) onChange(val);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "8px 20px",
          height: "56px",
          borderRadius: "28px",
          border: "2px solid rgba(255, 255, 255, 0.6)",
          backgroundColor: "transparent",
          color: "#fff",
          fontSize: "1.3rem",
          fontWeight: "bold",
          // minHeight: "56px",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          outline: "none",
          boxShadow: "none",
        }}
      >
        <img src={iconosConfig} alt="Configuración" width={26} height={26} />
        Calidad{" "}
        <span style={{ marginLeft: "10px", color: "gray" }}>
          {qualities.find((o) => o.value === value)?.label || "Auto"}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            background: "#08090C",
            border: "1px solid #333",
            zIndex: 100,
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "8px",
            minWidth: "120px",
          }}
        >
          {qualities.map((opt, i) => (
            <QualityOption
              key={opt.value}
              label={opt.label}
              onSelect={() => handleSelect(opt.value)}
              onClose={() => {
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Componente Principal PlayerControls ----

interface PlayerControlsProps {
  seekTime?: number;
  previewSeekTime?: number | null;
  loadedTime?: number;
  duration?: number;
  playing?: boolean;
  visible?: boolean;
  isLive?: boolean;
  volume?: number;
  muted?: boolean;
  episodes?: ProgramChapter[];
  currentEpisodeKey?: string;
  availableQualities?: { value: string; label: string }[];
  currentQuality?: string;
  onPlayButtonClick?: () => void;
  onSeek?: (time: number) => void;
  onSeekStart?: () => void;
  onSkip?: (seconds: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreen?: () => void;
  onQualityChange?: (val: string) => void;
  onEpisodeSelect?: (episode: ProgramChapter) => void;
  onHideControls?: () => void;
  onSidebarVisibilityChange?: (isOpen: boolean) => void;
  isNextEpisodeOverlayVisible?: boolean;
}

const PlayerControlsComponent = ({
  seekTime = 0,
  previewSeekTime = null,
  loadedTime = 0,
  duration = 0,
  playing,
  visible,
  isLive = false,
  volume = 1,
  muted = false,
  episodes = [],
  currentEpisodeKey,
  availableQualities = [],
  currentQuality = "auto",
  onPlayButtonClick,
  onSeek,
  onSeekStart,
  onSkip,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
  onQualityChange,
  onEpisodeSelect,
  onHideControls,
  onSidebarVisibilityChange,
  isNextEpisodeOverlayVisible,
}: PlayerControlsProps) => {
  const [isChaptersSidebarOpen, setIsChaptersSidebarOpen] = useState(false);

  useEffect(() => {
    if (!visible && isChaptersSidebarOpen) {
      setIsChaptersSidebarOpen(false);
    }
  }, [visible, isChaptersSidebarOpen]);

  useEffect(() => {
    if (onSidebarVisibilityChange) {
      onSidebarVisibilityChange(isChaptersSidebarOpen);
    }
  }, [isChaptersSidebarOpen, onSidebarVisibilityChange]);

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        zIndex: 998,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: 0,
          right: 0,
          padding: "0 55px",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            backgroundColor: "transparent",
            minHeight: "94px",
            transition: "opacity 0.3s ease",
          }}
        >
          <Seekbar
            seekTime={seekTime}
            previewSeekTime={previewSeekTime}
            loadedTime={loadedTime}
            duration={duration}
            isLive={isLive}
            playing={playing}
            volume={volume}
            muted={muted}
            onSeek={onSeek}
            onSeekStart={onSeekStart}
            onPlayPause={onPlayButtonClick}
            onSkip={onSkip}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
            onFullscreen={onFullscreen}
          />
        </div>

        {/* Botones Flotantes Arriba del Seekbar */}
        <div
          style={{
            position: "absolute",
            right: "55px",
            bottom: "140px",
            display: "flex",
            alignItems: "center",
            gap: "22px",
            zIndex: 2000,
          }}
        >
          {/* Play / Pause - Solo en LIVE */}
          {isLive && (
            <PlayerOptionButton
              onClick={onPlayButtonClick}
              icon={
                <img
                  src={playing ? iconosPause : iconosPlay}
                  alt={playing ? "Pausa" : "Reanudar"}
                  width={26}
                  height={26}
                />
              }
            />
          )}

          {/* Episodios y Reinicio Solo si NO es VIVO
          {!isLive && (
            <>
              <PlayerOptionButton
                onClick={() => onSeek && onSeek(0)}
                icon={
                  <img
                    src={iconosReiniciar}
                    alt="Reiniciar episodio"
                    width={26}
                    height={26}
                  />
                }
              />

              {episodes.length > 0 && (
                <PlayerOptionButton
                  onClick={() => setIsChaptersSidebarOpen(true)}
                  icon={
                    <img
                      src={iconosFila}
                      alt="Episodios"
                      width={26}
                      height={26}
                    />
                  }
                />
              )}
            </>
          )} */}

          {/* <PlayerQualityButton
            value={currentQuality}
            qualities={availableQualities}
            onChange={onQualityChange}
          /> */}
        </div>
      </div>

      {episodes.length > 0 && (
        <EpisodeSidebar
          episodes={episodes}
          currentEpisodeKey={currentEpisodeKey}
          visible={isChaptersSidebarOpen}
          onClose={() => setIsChaptersSidebarOpen(false)}
          onCloseAll={() => {
            setIsChaptersSidebarOpen(false);
            if (onHideControls) onHideControls();
          }}
          onEpisodeSelect={(episode) => {
            setIsChaptersSidebarOpen(false);
            if (episode.key !== currentEpisodeKey && onEpisodeSelect) {
              onEpisodeSelect(episode);
            } else if (onHideControls) {
              onHideControls();
            }
          }}
        />
      )}
    </div>
  );
};

export const PlayerControls = React.memo(PlayerControlsComponent);
