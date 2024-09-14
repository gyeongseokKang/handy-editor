import { AudioPlayerSegment } from "@/libs/react-timeline-editor/interface/segment";
import { EffectSourceParam, TimelineEffect } from "../../../interface/effect";

import audioControl from "../control/audioControl";

export interface AudioPlayerEffect extends TimelineEffect {
  source: {
    start?: (param: EffectSourceParam<AudioPlayerSegment>) => void;
    enter?: (param: EffectSourceParam<AudioPlayerSegment>) => void;
    leave?: (param: EffectSourceParam<AudioPlayerSegment>) => void;
    stop?: (param: EffectSourceParam<AudioPlayerSegment>) => void;
  };
}

const audioPlayerEffect: AudioPlayerEffect = {
  id: "audioPlayer",
  name: "audioPlayer",
  source: {
    start: ({ segment, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = segment.data.src;
        const id = segment.data.id;
        audioControl.start({
          id,
          src,
          startTime: segment.start,
          engine,
          time,
        });
      }
    },
    enter: ({ segment, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = segment.data.src;
        const id = segment.data.id;
        audioControl.start({
          id,
          src,
          startTime: segment.start,
          engine,
          time,
        });
      }
    },
    leave: ({ segment, engine }) => {
      const id = segment.data.id;
      audioControl.stop({ id: id, engine });
    },
    stop: ({ segment, engine }) => {
      const id = segment.data.id;
      audioControl.stop({ id: id, engine });
    },
  },
};

export const AudioPlayerEffect = {
  audioPlayer: audioPlayerEffect,
};
