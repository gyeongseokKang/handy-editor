import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ITimelineEngine, TimelineEngine } from "../engine/engine";

type State = {
  isPlaying: boolean;
  isWaveformVisible: boolean;
  isAutoscroll: boolean;
  engine: ITimelineEngine;
};

type Actions = {
  setIsPlaying: (isPlaying: State["isPlaying"]) => void;
  setIsAutoscroll: (isAutoscroll: State["isAutoscroll"]) => void;
  setWaveformVisible: (isWaveformVisible: State["isWaveformVisible"]) => void;
  setEngine: (engine: State["engine"]) => void;
  reset: () => void;
};

const initialState: State = {
  isPlaying: false,
  isAutoscroll: true,
  isWaveformVisible: true,
  engine: new TimelineEngine(),
};

const useEngineStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    setIsPlaying: (isPlaying) =>
      set((state) => {
        state.isPlaying = isPlaying;
      }),
    setIsAutoscroll: (isAutoscroll) =>
      set((state) => {
        state.isAutoscroll = isAutoscroll;
      }),
    setWaveformVisible: (isWaveformVisible) =>
      set((state) => {
        state.isWaveformVisible = isWaveformVisible;
      }),
    setEngine: (engine) => set({ engine }),
    reset: () => set(initialState),
  }))
);

export default useEngineStore;
