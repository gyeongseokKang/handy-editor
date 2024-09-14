import { TimelineAction } from "../../../interface/action";
import { EffectSourceParam, TimelineEffect } from "../../../interface/effect";
import audioControl from "../control/audioControl";

export interface AudioPlayerAction extends TimelineAction {
  data: {
    id?: string;
    src: string;
    name: string;
  };
}

export interface AudioPlayerEffect extends TimelineEffect {
  source: {
    start?: (param: EffectSourceParam<AudioPlayerAction>) => void;
    enter?: (param: EffectSourceParam<AudioPlayerAction>) => void;
    leave?: (param: EffectSourceParam<AudioPlayerAction>) => void;
    stop?: (param: EffectSourceParam<AudioPlayerAction>) => void;
  };
}

const audioPlayerEffect: AudioPlayerEffect = {
  id: "audioPlayer",
  name: "audioPlayer",
  source: {
    start: ({ action, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = action.data.src;
        const id = action.data.id;
        audioControl.start({
          id,
          src,
          startTime: action.start,
          engine,
          time,
        });
      }
    },
    enter: ({ action, engine, isPlaying, time }) => {
      if (isPlaying) {
        const src = action.data.src;
        const id = action.data.id;
        audioControl.start({
          id,
          src,
          startTime: action.start,
          engine,
          time,
        });
      }
    },
    leave: ({ action, engine }) => {
      const id = action.data.id;
      audioControl.stop({ id: id, engine });
    },
    stop: ({ action, engine }) => {
      const id = action.data.id;
      audioControl.stop({ id: id, engine });
    },
  },
};

export const AudioPlayerEffect = {
  audioPlayer: audioPlayerEffect,
};
