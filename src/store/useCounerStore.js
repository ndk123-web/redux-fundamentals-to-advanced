import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCountStore = create(
  persist((set) => ({
    count: 0,
    increament: () => set((state) => ({ count: state.count + 1 })),
    decreament: () => set((state) => ({count: state.count-1}))     
  }),

  {
    name: "count",
    getStorage: () => localStorage
  }
)
);

export { useCountStore }
