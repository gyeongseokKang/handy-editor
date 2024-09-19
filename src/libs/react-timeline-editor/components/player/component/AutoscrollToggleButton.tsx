import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { CgScrollH } from "react-icons/cg";

const AutoscrollToggleButton = () => {
  const isAutoscroll = useEngineStore((state) => state.isAutoscroll);
  const setIsAutoscroll = useEngineStore((state) => state.setIsAutoscroll);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsAutoscroll(!isAutoscroll);
            }}
          >
            <CgScrollH
              size={24}
              className={isAutoscroll ? "text-blue-500" : "text-gray-500"}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Auto Scroll</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoscrollToggleButton;
