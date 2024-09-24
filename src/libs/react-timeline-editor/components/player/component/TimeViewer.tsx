import useDataStore from "@/libs/react-timeline-editor/store/DataStore";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { getTimeLabel } from "@/libs/react-timeline-editor/utils/timeUtils";
import { useEffect, useMemo, useState } from "react";

const TimeViewer = () => {
  const engine = useEngineStore((state) => state.engine);
  const timelineRowList = useDataStore((state) => state.timelineRowList);
  const [time, setTime] = useState(0);

  const lastTime = useMemo(() => {
    return timelineRowList
      .flatMap((row) => row.segments)
      .reduce((acc, segment) => {
        return Math.max(acc, segment.end);
      }, 0);
  }, [timelineRowList]);

  useEffect(() => {
    if (!engine) return;
    engine.on("setTimeByTick", ({ time }) => {
      setTime(time);
    });
    engine.on("afterSetTime", ({ time }) => {
      setTime(time);
    });

    return () => {
      engine.off("setTimeByTick");
      engine.off("afterSetTime");
    };
  }, [engine]);

  return (
    <span className="flex gap-1 items-center">
      <span className="min-w-20 flex justify-center">{getTimeLabel(time)}</span>
      /
      <span className="min-w-20 flex justify-center">
        {getTimeLabel(lastTime)}
      </span>
    </span>
  );
};

export default TimeViewer;
