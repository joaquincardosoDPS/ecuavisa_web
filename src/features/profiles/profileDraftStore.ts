import { create } from "zustand";

interface ProfileDraftState {
  name: string;
  selectedAvatar: string | null;
  setName: (name: string) => void;
  setSelectedAvatar: (avatar: string | null) => void;
  clear: () => void;
}

export const useProfileDraftStore = create<ProfileDraftState>((set) => ({
  name: "",
  selectedAvatar: null,
  setName: (name) => set({ name }),
  setSelectedAvatar: (selectedAvatar) => set({ selectedAvatar }),
  clear: () => set({ name: "", selectedAvatar: null }),
}));
