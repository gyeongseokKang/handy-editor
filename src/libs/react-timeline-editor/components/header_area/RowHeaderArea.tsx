import { useEffect, useRef } from "react";

import {
  EDIT_ARED_DEFAULT_MARGIN_TOP,
  ROW_HEADER_DEFAULT_WIDTH,
  TIME_AREA_DEFAULT_HEIGHT,
} from "../../interface/const";
import { TimelineRow } from "../../interface/segment";
import useScrollStore from "../../store/ScrollStore";

interface RowHeaderAreaProps {
  data: TimelineRow[];
  width?: number;
  getRowHeader?: (row: TimelineRow, rowIndex: number) => any;
}

const RowHeaderArea = ({ data, width, getRowHeader }: RowHeaderAreaProps) => {
  const rowWidth = width || ROW_HEADER_DEFAULT_WIDTH;
  const domRef = useRef<HTMLDivElement>();
  const scrollTop = useScrollStore((state) => state.scrollTop);

  useEffect(() => {
    if (domRef.current) {
      domRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div
      ref={domRef}
      onScroll={(e) => {
        const target = e.target as HTMLDivElement;
        useScrollStore.getState().setScrollState({
          scrollTop: target.scrollTop,
        });
      }}
      className={"flex flex-col h-full overflow-hidden"}
      style={{
        width: rowWidth,
        minWidth: rowWidth,
        paddingTop: EDIT_ARED_DEFAULT_MARGIN_TOP + TIME_AREA_DEFAULT_HEIGHT,
      }}
    >
      {data.map((item, index) => (
        <div
          className="flex items-center justify-center min-h-[50px]"
          key={item.id}
        >
          {getRowHeader?.(item, index)}
        </div>
      ))}
    </div>
  );
};

export default RowHeaderArea;
