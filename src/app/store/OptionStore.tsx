import { ScaleState } from "@/libs/react-timeline-editor/interface/timeline";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  optionType: "editor" | "row" | "segment";
  editorOption: {
    scaleState: ScaleState;
  };
};

type Actions = {
  setOptionType: (optionType: State["optionType"]) => void;
  updateScaleState: (scaleState: Partial<ScaleState>) => void;
  reset: () => void;
};

const initialState: State = {
  optionType: "editor",
  editorOption: {
    scaleState: {
      scale: 60,
      scaleWidth: 300,
      startLeft: 20,
      scaleSplitCount: 10,
    },
  },
};

const useOptionStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    setOptionType: (optionType: State["optionType"]) =>
      set((state) => {
        state.optionType = optionType;
      }),
    updateScaleState: (scaleState: Partial<ScaleState>) =>
      set((state) => {
        state.editorOption.scaleState = {
          ...state.editorOption.scaleState,
          ...scaleState,
        };
      }),
    reset: () => set(initialState),
  }))
);

export default useOptionStore;
