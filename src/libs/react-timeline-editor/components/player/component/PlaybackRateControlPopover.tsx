import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { MdSpeed } from "react-icons/md";

interface PlaybackRateControlPopoverProps {
  rate: number;
  handleChange: (rate: number) => void;
}

const PlaybackRateControlPopover = ({
  rate,
  handleChange,
}: PlaybackRateControlPopoverProps) => {
  const labelRate = rate.toFixed(1) + "x";
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <div className="flex gap-1 items-center">
              <MdSpeed />
              {labelRate}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-w-40 flex items-center gap-2"
        >
          <Slider
            className="w-72"
            defaultValue={[rate]}
            onValueChange={(value) => {
              handleChange(value[0]);
            }}
            max={4}
            min={0.5}
            step={0.5}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PlaybackRateControlPopover;
