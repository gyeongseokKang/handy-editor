import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { useEffect, useState } from "react";

const TimeViewer = () => {
  const engine = useEngineStore((state) => state.engine);

  const [time, setTime] = useState(0);

  const float = (parseInt((time % 1) * 100 + "") + "").padStart(2, "0");
  const min = (parseInt(time / 60 + "") + "").padStart(2, "0");
  const second = (parseInt((time % 60) + "") + "").padStart(2, "0");

  const timeRender = `${min}:${second}.${float.replace("0.", "")}`;

  useEffect(() => {
    if (!engine) return;
    engine.on("setTimeByTick", ({ time }) => {
      setTime(time);
    });
    engine.on("afterSetTime", ({ time }) => {
      setTime(time);
    });
  }, [engine]);

  return <>{timeRender}</>;
};

export default TimeViewer;
