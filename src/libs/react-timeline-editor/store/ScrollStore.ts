import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
};

type Actions = {
  setScrollState: (scrollState: Partial<State>) => void;
  reset: () => void;
};

const initialState: State = {
  scrollHeight: undefined,
  scrollLeft: undefined,
  scrollTop: undefined,
  scrollWidth: undefined,
};

const useScrollStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    setScrollState: (scrollState) =>
      set((state) => {
        const { scrollHeight, scrollLeft, scrollTop, scrollWidth } =
          scrollState;
        if (scrollHeight !== undefined) state.scrollHeight = scrollHeight;
        if (scrollLeft !== undefined) state.scrollLeft = scrollLeft;
        if (scrollTop !== undefined) state.scrollTop = scrollTop;
        if (scrollWidth !== undefined) state.scrollWidth = scrollWidth;
      }),
    reset: () => set(initialState),
  }))
);

export default useScrollStore;
