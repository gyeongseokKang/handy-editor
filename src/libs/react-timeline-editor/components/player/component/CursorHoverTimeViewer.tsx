import { Badge } from "@/components/ui/badge";
import useScrollStore from "@/libs/react-timeline-editor/store/ScrollStore";
import { getTimeLabel } from "@/libs/react-timeline-editor/utils/timeUtils";

const CursorHoverTimeViewer = () => {
  const timelineCursorHoverTime = useScrollStore(
    (state) => state.timelineCursorHoverTime
  );

  return (
    <span className="min-w-32 flex justify-center items-center flex-col">
      {timelineCursorHoverTime > 0 && (
        <>
          <Badge className="text-xs py-0">Cursor</Badge>
          <p className="text-sm">{getTimeLabel(timelineCursorHoverTime)}</p>
        </>
      )}
    </span>
  );
};

export default CursorHoverTimeViewer;
