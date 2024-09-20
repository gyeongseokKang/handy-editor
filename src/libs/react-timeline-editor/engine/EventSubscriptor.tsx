import useOptionStore from "@/app/store/OptionStore";
import { useEffect } from "react";
import { TimelineState } from "../interface/timeline";
import useEngineStore from "../store/EngineStore";

interface EventSubscriptorProps {
  timelineState: React.MutableRefObject<TimelineState>;
}

const EventSubscriptor = ({ timelineState }: EventSubscriptorProps) => {
  const engine = useEngineStore((state) => state.engine);

  useEffect(() => {
    if (!engine) return;
    engine.on("play", () => {
      useEngineStore.getState().setIsPlaying(true);
    });
    engine.on("paused", () => {
      useEngineStore.getState().setIsPlaying(false);
    });
    engine.on("stop", () => {
      useEngineStore.getState().setIsPlaying(false);
      timelineState.current.setScrollLeft(0);
    });

    engine.on("setTimeByTick", ({ time }) => {
      const isAutoscroll = useEngineStore.getState().isAutoscroll;
      if (isAutoscroll) {
        const autoScrollFrom = 500;

        const { scaleWidth, scale, startLeft } =
          useOptionStore.getState().editorOption.scaleState;
        const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
        timelineState.current.setScrollLeft(left);
      }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.offAll();
    };
  }, [engine]);

  return <></>;
};

export default EventSubscriptor;
