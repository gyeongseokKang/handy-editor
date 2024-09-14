import { VideoPlayerSegment } from "@/libs/react-timeline-editor/interface/segment";
import { EffectSourceParam, TimelineEffect } from "../../../interface/effect";

import videoControl from "../control/videoControl";

export interface VideoPlayerEffect extends TimelineEffect {
  source: {
    start?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    enter?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    leave?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    stop?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
  };
}

const videoPlayerEffect: VideoPlayerEffect = {
  id: "videoPlayer",
  name: "videoPlayer",
  source: {
    start: ({ segment, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = segment.data.src;
        const id = segment.id;
        videoControl.start({
          id,
          src,
          startTime: segment.start,
          engine,
          time,
        });
      }
    },
    enter: ({ segment, engine, isPlaying, time }) => {
      const id = segment.id;
      if (isPlaying) {
        const src = segment.data.src;
        videoControl.start({
          id,
          src,
          startTime: segment.start,
          engine,
          time,
        });
      }
      videoControl.enter({ id: id });
    },
    leave: ({ segment, engine }) => {
      const id = segment.id;
      videoControl.stop({ id: id, engine });
      videoControl.leave({ id: id });
    },
    stop: ({ segment, engine }) => {
      const id = segment.id;
      videoControl.stop({ id: id, engine });
    },
  },
};

export const VideoPlayerEffect = {
  videoPlayer: videoPlayerEffect,
};
