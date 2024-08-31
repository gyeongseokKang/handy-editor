import { TimelineAction, TimelineRow } from "../../interface/action";
import { TimelineEffect } from "../../interface/effect";
import audioControl from "./audioControl";

export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 20;

export interface CustomTimelineAction extends TimelineAction {
  data: {
    src: string;
    name: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}

export const mockEffect2: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "播放音效",
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      leave: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
      stop: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
    },
  },
};

export const mockData2: CusTomTimelineRow[] = [
  {
    id: "1",
    actions: [
      {
        id: "내손을잡아",
        start: 0,
        end: 10,
        effectId: "effect0",
        data: {
          src: "/audio/내손을잡아.mp3",
          name: "내손을잡아",
        },
      },
    ],
  },
  {
    id: "2",
    actions: [
      {
        id: "최애의아이",
        start: 5,
        end: 20,
        effectId: "effect0",
        data: {
          src: "/audio/최애의아이.mp3",
          name: "최애의아이",
        },
      },
    ],
  },
];
