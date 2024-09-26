import { VideoPlayerSegment } from "@/libs/react-timeline-editor/interface/segment";
import { EffectSourceParam, TimelineEffect } from "../../../interface/effect";

import videoControl from "../control/videoControl";

export interface VideoPlayerEffect extends TimelineEffect {
  id: "videoPlayer";
  source: {
    start?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    enter?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    leave?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    stop?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    update?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
    load?: (param: EffectSourceParam<VideoPlayerSegment>) => void;
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
          startOffset: segment.data.startOffset,
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
          startOffset: segment.data.startOffset,
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
    update: ({ segment, isPlaying, time }) => {
      const id = segment.id;
      videoControl.update({
        id,
        isPlaying,
        time: time,
        startTime: segment.start,
        startOffset: segment.data.startOffset,
      });
    },
    load: ({ segment, engine }) => {
      const src = segment.data.src;
      const id = segment.id;
      videoControl.load({ id: id, src, engine });
    },
  },
};

export const VideoPlayerEffect = {
  videoPlayer: videoPlayerEffect,
};
