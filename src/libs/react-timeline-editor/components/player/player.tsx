import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdStop } from "react-icons/md";
import useEngineStore from "../../store/EngineStore";
import AutoscrollToggleButton from "./component/AutoscrollToggleButton";
import PlaybackRateControlPopover from "./component/PlaybackRateControlPopover";
import TimeViewer from "./component/TimeViewer";

const TimelinePlayer = () => {
  const isPlaying = useEngineStore((state) => state.isPlaying);
  const engine = useEngineStore((state) => state.engine);
  const [rate, setRate] = useState(1);

  const handlePlayOrPause = () => {
    if (isPlaying) {
      engine.pause();
    } else {
      engine.play({ autoEnd: true });
    }
  };

  const handleStop = () => {
    engine.stop();
  };

  const handleRateChange = (rate: number) => {
    setRate(rate);
    engine.setPlayRate(rate);
  };

  return (
    <div className="flex gap-4 w-full items-center py-4">
      <div className="flex gap-1">
        <Button variant="outline" size="icon" onClick={handlePlayOrPause}>
          {isPlaying ? <IoMdPause size={20} /> : <IoMdPlay size={20} />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleStop}>
          <MdStop size={24} />
        </Button>
      </div>
      <TimeViewer />
      <div className="ml-auto flex items-center gap-1">
        <AutoscrollToggleButton />
        <PlaybackRateControlPopover
          handleChange={handleRateChange}
          rate={rate}
        />
      </div>
    </div>
  );
};

export default TimelinePlayer;
