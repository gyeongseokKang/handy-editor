import { Button } from "@/components/ui/button";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { useEffect, useState } from "react";

const SegmentSplitButton = () => {
  const [time, setTime] = useState(0);
  const engine = useEngineStore((state) => state.engine);
  const selectedSegmentList = useDataStore(
    (state) => state.selectedSegmentList
  );

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

  const isSplitDisabled =
    selectedSegmentList.length !== 1 ||
    time <= selectedSegmentList[0].start ||
    time >= selectedSegmentList[0].end;

  const isMergeDisabled = selectedSegmentList.length < 2;

  const handleSplit = () => {
    DataStoreUtil.splitSegment({
      segment: selectedSegmentList[0],
      splitTime: time,
    });
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        disabled
        // disabled={isSplitDisabled}
        onClick={handleSplit}
      >
        Split
      </Button>
      <Button variant="outline" disabled={isMergeDisabled}>
        Merge
      </Button>
    </div>
  );
};

export default SegmentSplitButton;
