import { create } from "zustand";

interface CursorState {
  mousePosition: { x: number; y: number };
  cursorVariant: string;
  setMousePosition: (position: { x: number; y: number }) => void;
  setCursorVariant: (variant: string) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  mousePosition: { x: 0, y: 0 },
  cursorVariant: "default",
  setMousePosition: (position) => set({ mousePosition: position }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  handleMouseEnter: () => set({ cursorVariant: "hover" }),
  handleMouseLeave: () => set({ cursorVariant: "default" }),
}));