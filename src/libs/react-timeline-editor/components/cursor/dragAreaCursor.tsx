import useOptionStore from "@/app/media-editor/store/OptionStore";
import { cn } from "@/lib/utils";
import React, { FC, useEffect, useRef } from "react";
import { CommonProp } from "../../interface/common_prop";
import { prefix } from "../../utils/deal_class_prefix";
import {
  parserTimeToPixel,
  parserTimeToTransform,
} from "../../utils/deal_data";
import { RowDnd } from "../row_rnd/row_rnd";
import { RowRndApi } from "../row_rnd/row_rnd_interface";

/** 애니메이션 타임라인 컴포넌트의 매개변수 */
export type dragAreaCursorProps = CommonProp & {
  drag: {
    start: number;
    end: number;
  };
  /** 좌측으로부터의 스크롤 거리 */
  scrollLeft: number;
  /** 커서 위치 설정 */
  setCursor: (param: { left?: number; time?: number }) => boolean;
  /** 타임라인 영역의 DOM ref */
  areaRef: React.MutableRefObject<HTMLDivElement>;
  /** 스크롤 좌측 설정 */
  deltaScrollLeft: (delta: number) => void;
};

export const DragAreaCursor: FC<dragAreaCursorProps> = ({
  drag,
  cursorTime,
  timelineWidth,
  scrollLeft,
  areaRef,
  maxScaleCount,
  deltaScrollLeft,
}) => {
  const rowRnd = useRef<RowRndApi>();
  const draggingLeft = useRef<undefined | number>();

  const { scale, scaleWidth, startLeft } = useOptionStore(
    (state) => state.editorOption.scaleState
  );
  const { width } = parserTimeToTransform(
    {
      start: drag.start,
      end: drag.end,
    },
    {
      scaleWidth,
      scale,
      startLeft,
    }
  );

  useEffect(() => {
    if (typeof draggingLeft.current === "undefined") {
      rowRnd.current.updateLeft(
        parserTimeToPixel(cursorTime, { startLeft, scaleWidth, scale }) -
          scrollLeft
      );
    }
  }, [cursorTime, startLeft, scaleWidth, scale, scrollLeft]);

  return (
    <RowDnd
      start={startLeft}
      width={width}
      ref={rowRnd}
      parentRef={areaRef}
      bounds={{
        left: 0,
        right: Math.min(
          timelineWidth,
          maxScaleCount * scaleWidth + startLeft - scrollLeft
        ),
      }}
      deltaScrollLeft={deltaScrollLeft}
      enableDragging={false}
      enableResizing={false}
    >
      <div className={prefix("cursor") + " bg-red-500/10"}>
        <div className={cn(prefix("cursor-area"))} />
      </div>
    </RowDnd>
  );
};
