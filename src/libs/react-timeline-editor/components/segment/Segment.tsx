"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import { getTimeLabel } from "@/libs/react-timeline-editor/utils/timeUtils";
import { TimelineRow, TimelineSegment } from "../../interface/segment";
import AudioBufferSegment from "./component/AudioBufferSegment";

interface SegmentProps {
  segment: TimelineSegment;
  row: TimelineRow;
  isDragging: boolean;
  isResizing: boolean;
}
const Segment = ({ segment, row, isDragging, isResizing }: SegmentProps) => {
  const isSelected = useDataStore((state) => state.selectedSegmentList).find(
    (seg) => seg.id === segment.id
  );

  const isWaveSurferSegment =
    segment.effectId === "audioPlayer" || segment.effectId === "videoPlayer";

  if (!("data" in segment)) {
    return <div>base segment</div>;
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "relative w-full h-full flex justify-center items-center text-xl text-white ring-2",
              isSelected ? "ring-blue-500" : "ring-transparent",
              {
                "cursor-ew-resize": isDragging,
              }
            )}
            onClick={(e) => {
              DataStoreUtil.selectSegment(segment);
              e.stopPropagation();
            }}
          >
            <DraggingTimelineTooltip
              time={segment.start}
              direction="left"
              isResizing={isResizing}
              isDragging={isDragging}
            />
            {isWaveSurferSegment ? (
              <AudioBufferSegment segment={segment} />
            ) : (
              <div className={cn("w-full flex justify-start px-4")}>
                {segment.data.name}
              </div>
            )}
            <DraggingTimelineTooltip
              time={segment.end}
              direction="right"
              isResizing={isResizing}
              isDragging={isDragging}
              duration={segment.end - segment.start}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              DataStoreUtil.deleteAndUpdateSegment({
                segment,
              });
            }}
          >
            Delete
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Copy</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem
                onClick={() => {
                  DataStoreUtil.copyAndUpdateSegment({
                    segment,
                    type: "newLine",
                  });
                }}
              >
                Copy to new row
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  DataStoreUtil.copyAndUpdateSegment({
                    segment,
                    type: "sameLine",
                  });
                }}
              >
                Copy to same row
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default Segment;

const DraggingTimelineTooltip = ({
  time,
  direction,
  isDragging,
  isResizing,
  duration,
}: {
  time: number | string;
  direction: "left" | "right";
  isDragging: boolean;
  isResizing: boolean;
  duration?: number;
}) => {
  if (!isDragging && !isResizing) {
    return null;
  }

  function isConvertibleToNumber(value) {
    return !isNaN(Number(value));
  }

  const renderTime =
    typeof time === "number"
      ? time
      : isConvertibleToNumber(time)
      ? Number(time)
      : "-";

  return (
    <>
      <Badge
        className={cn(
          `flex justify-center absolute text-xs  min-w-16`,
          direction === "left" ? "-left-20 top-0" : "-right-20 bottom-0"
        )}
      >
        {renderTime !== "-" && getTimeLabel(Number(renderTime))}
      </Badge>
      {duration && isResizing && (
        <Badge
          variant="secondary"
          className={cn(
            `flex justify-center absolute text-xs min-w-16 -right-20 top-0`
          )}
        >
          {getTimeLabel(Number(duration))}
        </Badge>
      )}
    </>
  );
};
