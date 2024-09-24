import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  timelineCursorHoverTime: number;
};

type Actions = {
  setScrollState: (scrollState: Partial<State>) => void;
  setTimelineCursorHoverTime: (time: number) => void;
  reset: () => void;
};

const initialState: State = {
  scrollHeight: undefined,
  scrollLeft: undefined,
  scrollTop: undefined,
  scrollWidth: undefined,
  timelineCursorHoverTime: undefined,
};

const useScrollStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    setTimelineCursorHoverTime: (time) =>
      set((state) => {
        state.timelineCursorHoverTime = time;
      }),

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
