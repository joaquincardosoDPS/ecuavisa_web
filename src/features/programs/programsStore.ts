import { create } from 'zustand';
import type { Program } from '@/interfaces/catalog.interface';

interface ProgramsState {
    activeProgram: Program | null;
    setActiveProgram: (program: Program | null) => void;
}

export const useProgramsStore = create<ProgramsState>((set) => ({
    activeProgram: null,
    setActiveProgram: (program) => set({ activeProgram: program }),
}));
