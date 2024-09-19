import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { PiWaveformBold } from "react-icons/pi";

const WaveformToggleButton = () => {
  const isWaveformVisible = useEngineStore((state) => state.isWaveformVisible);
  const setWaveformVisible = useEngineStore(
    (state) => state.setWaveformVisible
  );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setWaveformVisible(!isWaveformVisible);
            }}
          >
            <PiWaveformBold
              size={24}
              className={isWaveformVisible ? "text-blue-500" : "text-gray-500"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Waveform</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WaveformToggleButton;
