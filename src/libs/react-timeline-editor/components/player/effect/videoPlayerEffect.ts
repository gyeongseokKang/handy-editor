import { TimelineAction } from "../../../interface/action";
import { EffectSourceParam, TimelineEffect } from "../../../interface/effect";
import videoControl from "../control/videoControl";

export interface VideoPlayerAction extends TimelineAction {
  data: {
    id?: string;
    src: string;
    name: string;
  };
}

export interface VideoPlayerEffect extends TimelineEffect {
  source: {
    start?: (param: EffectSourceParam<VideoPlayerAction>) => void;
    enter?: (param: EffectSourceParam<VideoPlayerAction>) => void;
    leave?: (param: EffectSourceParam<VideoPlayerAction>) => void;
    stop?: (param: EffectSourceParam<VideoPlayerAction>) => void;
  };
}

const videoPlayerEffect: VideoPlayerEffect = {
  id: "videoPlayer",
  name: "videoPlayer",
  source: {
    start: ({ action, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = action.data.src;
        const id = action.data.id;
        videoControl.start({
          id,
          src,
          startTime: action.start,
          engine,
          time,
        });
      }
    },
    enter: ({ action, engine, isPlaying, time }) => {
      const id = action.data.id;
      if (isPlaying) {
        const src = action.data.src;
        videoControl.start({
          id,
          src,
          startTime: action.start,
          engine,
          time,
        });
      }
      videoControl.enter({ id: id });
    },
    leave: ({ action, engine }) => {
      const id = action.data.id;
      videoControl.stop({ id: id, engine });
      videoControl.leave({ id: id });
    },
    stop: ({ action, engine }) => {
      const id = action.data.id;
      videoControl.stop({ id: id, engine });
    },
  },
};

export const VideoPlayerEffect = {
  videoPlayer: videoPlayerEffect,
};
