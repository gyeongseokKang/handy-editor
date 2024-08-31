import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import React, { FC, useEffect, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { ScaleState, TimelineState } from "../../interface/timeline";

export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];

const TimelinePlayer: FC<{
  timelineState: React.MutableRefObject<TimelineState>;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
  scaleState: React.MutableRefObject<ScaleState>;
}> = ({ scaleState, timelineState, autoScrollWhenPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;
    engine.listener.on("play", () => setIsPlaying(true));
    engine.listener.on("paused", () => setIsPlaying(false));
    engine.listener.on("afterSetTime", ({ time }) => setTime(time));

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
    };
  }, []);

  useEffect(() => {
    const engine = timelineState.current;
    engine.listener.on("setTimeByTick", ({ time }) => {
      setTime(time);
      if (autoScrollWhenPlay.current) {
        const autoScrollFrom = 500;
        const left =
          time * (scaleState.current.scaleWidth / scaleState.current.scale) +
          scaleState.current.startLeft -
          autoScrollFrom;
        timelineState.current.setScrollLeft(left);
      }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.off("setTimeByTick");
    };
  }, []);

  const handlePlayOrPause = () => {
    if (!timelineState.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };

  const handleRateChange = (rate: number) => {
    if (!timelineState.current) return;
    timelineState.current.setPlayRate(rate);
  };

  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
    const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
    const second = (parseInt((time % 60) + "") + "").padStart(2, "0");
    return <>{`${min}:${second}.${float.replace("0.", "")}`}</>;
  };

  return (
    <div className="flex gap-4 w-full items-center p-4">
      <div className="play-control" onClick={handlePlayOrPause}>
        {isPlaying ? <IoMdPause size={30} /> : <IoMdPlay size={30} />}
      </div>

      <div className="flex gap-1 items-center">
        <Slider
          className="w-[180px]"
          defaultValue={[1]}
          onValueChange={(value) => {
            setRate(value[0]);
            handleRateChange(value[0]);
          }}
          max={2}
          min={0.25}
          step={0.25}
        />
        <Label>{rate}x 배속재생</Label>
      </div>
      <div className="time">{timeRender(time)}</div>
    </div>
  );
};

export default TimelinePlayer;
