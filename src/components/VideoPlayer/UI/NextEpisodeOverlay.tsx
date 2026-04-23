import React, { memo, useCallback } from 'react';
import type { Chapter } from '@/interfaces/catalog.interface';


interface NextEpisodeOverlayProps {
    episode: Chapter;
    onSelect: (episode: Chapter) => void;
    onDismiss?: () => void;
    focusKey?: string;
    countdown?: number;
    controlsVisible?: boolean;
}

export const NEXT_EPISODE_FOCUS_KEY = 'next-episode-overlay';

const NextEpisodeOverlayComponent = ({ episode, onSelect, countdown, controlsVisible }: NextEpisodeOverlayProps) => {

    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const bottomPosition = controlsVisible ? '12vw' : '4vw';

    const handleSelect = useCallback(() => {
        onSelect(episode);
    }, [onSelect, episode]);

    return (
        <div style={{
            position: 'absolute',
            bottom: bottomPosition,
            right: '4vw',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.4s ease-out forwards',
            transition: 'bottom 0.3s ease',
        }}>
            <style>{`
                .next-episode-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1.2vw;
                    border-radius: 0.6vw;
                    background: linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(10,10,10,0.95) 100%);
                    border: 0.2vw solid transparent;
                    box-shadow: 0 1vw 2vw rgba(0,0,0,0.5);
                    cursor: pointer;
                    transition: border 0.2s ease, transform 0.2s ease;
                    transform: scale(1);
                    width: 32vw;
                    box-sizing: border-box;
                }
                .next-episode-card.focused, .next-episode-card:focus, .next-episode-card:focus-visible {
                    border: 0.2vw solid #FA6428;
                    transform: scale(1.05);
                    outline: none;
                }
            `}</style>
            <div
                className="next-episode-card"
                onClick={handleSelect}
            >
                <div style={{
                    fontSize: '1.1vw',
                    color: '#FA6428',
                    fontWeight: 'bold',
                    marginBottom: '0.8vw',
                    fontFamily: 'Roboto, sans-serif'
                }}>
                    A continuación
                </div>

                <div style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}>
                    <div style={{
                        width: '13vw',
                        aspectRatio: '16/9',
                        borderRadius: '0.4vw',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative'
                    }}>
                        <img
                            src={episode.image || ""}
                            alt={episode.title}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        {countdown !== undefined && countdown > 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                paddingTop: '1.5vw',
                                paddingBottom: '0.4vw',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                                textAlign: 'center',
                                fontSize: '0.9vw',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                En {countdown} segundos
                            </div>
                        )}
                    </div>

                    <div style={{
                        fontSize: '1.1vw',
                        color: 'white',
                        fontWeight: 'bold',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'Roboto, sans-serif'
                    }}>
                        {episode.title}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NextEpisodeOverlay = memo(NextEpisodeOverlayComponent);
export default NextEpisodeOverlay;
