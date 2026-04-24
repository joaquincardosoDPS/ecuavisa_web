// VideoPlayer Module — Public API
// Import everything from this barrel when consuming the VideoPlayer module.
// This module is designed to be self-contained and portable across projects.

// Main component
export { VideoPlayer } from './VideoPlayer';

// Background video utility
export { HlsBackgroundVideo } from './HlsBackgroundVideo';

// Types
export type {
    VideoPlayerProps,
    Chapter,
    ProgramChapter,
    ImageSet,
    VodMediaInfo,
    PlayerState,
    DeviceAdInfo,
} from './types';
