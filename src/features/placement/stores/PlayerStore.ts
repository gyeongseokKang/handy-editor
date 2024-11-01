import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isPlaying: boolean;
  mediaPlayer: Player;
  segment: Segment;
  segmentList: Segment[];
};

type Actions = {
  changeIsPlaying: (isPlaying: boolean) => void;
  setMediaPlayer: (mediaPlayer: State["mediaPlayer"]) => void;
  setSegment: (segment: Segment) => void;
  addSegmentList: (segment: Segment) => void;
  reset: () => void;
};

const initialState: State = {
  isPlaying: false,
  mediaPlayer: undefined,
  segment: undefined,
  segmentList: [],
};

const usePlayerStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    changeIsPlaying: (isPlaying) =>
      set((state) => {
        state.isPlaying = isPlaying;
      }),
    setMediaPlayer: (mediaPlayer) =>
      set((state) => {
        state.mediaPlayer = mediaPlayer;
      }),
    setSegment: (segment) =>
      set((state) => {
        state.segment = segment;
      }),
    addSegmentList: (segment) =>
      set((state) => {
        state.segmentList.push(segment);
      }),
    reset: () => set(initialState),
  }))
);

export default usePlayerStore;

interface Player {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  prev: () => void;
}

export interface Segment {
  start: number;
  end: number;
  id: string;
}
