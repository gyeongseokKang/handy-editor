import useDataStore from "@/libs/react-timeline-editor/store/DataStore";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { useEffect, useMemo, useState } from "react";

const TimeViewer = () => {
  const engine = useEngineStore((state) => state.engine);
  const timelineRowList = useDataStore((state) => state.timelineRowList);
  const [time, setTime] = useState(0);

  const lastTime = useMemo(() => {
    return timelineRowList.reduce((acc, row) => {
      const lastSegment = row.segments.sort(
        (a, b) => b.end + b.start - a.end + a.start
      )[0];
      return Math.max(acc, lastSegment.end);
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
  }, [engine]);

  return (
    <span className="flex gap-1 items-center">
      <span className="min-w-20 flex justify-center">{getLabel(time)}</span>/
      <span className="min-w-20 flex justify-center">{getLabel(lastTime)}</span>
    </span>
  );
};

export default TimeViewer;

const getLabel = (time: number) => {
  const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
  const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
  const second = (parseInt((time % 60) + "") + "").padStart(2, "0");

  return `${min}:${second}.${float.replace("0.", "")}`;
};
