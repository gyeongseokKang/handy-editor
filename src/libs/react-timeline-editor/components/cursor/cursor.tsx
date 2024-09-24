import useOptionStore from "@/app/store/OptionStore";
import React, { FC, useEffect, useRef } from "react";
import { CommonProp } from "../../interface/common_prop";
import { prefix } from "../../utils/deal_class_prefix";
import { parserPixelToTime, parserTimeToPixel } from "../../utils/deal_data";
import { RowDnd } from "../row_rnd/row_rnd";
import { RowRndApi } from "../row_rnd/row_rnd_interface";

/** 애니메이션 타임라인 컴포넌트의 속성 타입 */
export type CursorProps = CommonProp & {
  /** 왼쪽으로부터의 스크롤 거리 */
  scrollLeft: number;
  /** 커서 위치 설정 */
  setCursor: (param: { left?: number; time?: number }) => boolean;
  /** 타임라인 영역의 DOM 참조 */
  areaRef: React.MutableRefObject<HTMLDivElement>;
  /** 스크롤 왼쪽 값 설정 */
  deltaScrollLeft: (delta: number) => void;
  /** 스크롤 동기화용 참조 (TODO: 이 데이터는 스크롤을 드래그할 때 동기화되지 않는 문제를 임시로 해결하기 위한 용도) */
};

export const Cursor: FC<CursorProps> = ({
  disableDrag,
  cursorTime,
  setCursor,
  timelineWidth,
  scrollLeft,
  areaRef,
  maxScaleCount,
  deltaScrollLeft,
  onCursorDragStart,
  onCursorDrag,
  onCursorDragEnd,
}) => {
  const { scale, scaleWidth, startLeft } = useOptionStore(
    (state) => state.editorOption.scaleState
  );
  const rowRnd = useRef<RowRndApi>();
  const draggingLeft = useRef<undefined | number>();

  useEffect(() => {
    if (typeof draggingLeft.current === "undefined") {
      // 드래그 중이 아닐 때는 외부에서 전달받은 값으로 커서의 위치를 업데이트
      rowRnd.current.updateLeft(
        parserTimeToPixel(cursorTime, { startLeft, scaleWidth, scale }) -
          scrollLeft
      );
    }
  }, [cursorTime, startLeft, scaleWidth, scale, scrollLeft]);

  return (
    <RowDnd
      start={startLeft}
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
      enableDragging={!disableDrag}
      enableResizing={false}
      onDragStart={() => {
        console.log("cursorTime", cursorTime);
        onCursorDragStart && onCursorDragStart(cursorTime);
        draggingLeft.current =
          parserTimeToPixel(cursorTime, { startLeft, scaleWidth, scale }) -
          scrollLeft;
        rowRnd.current.updateLeft(draggingLeft.current);
      }}
      onDragEnd={() => {
        const time = parserPixelToTime(draggingLeft.current + scrollLeft, {
          startLeft,
          scale,
          scaleWidth,
        });
        setCursor({ time });
        onCursorDragEnd && onCursorDragEnd(time);
        draggingLeft.current = undefined;
      }}
      onDrag={({ left }, scroll = 0) => {
        if (!scroll || scrollLeft === 0) {
          // 드래그 시, 현재 위치가 최소값보다 작은 경우 최소값으로 설정
          if (left < startLeft - scrollLeft)
            draggingLeft.current = startLeft - scrollLeft;
          else draggingLeft.current = left;
        } else {
          // 자동 스크롤 중일 때, 현재 위치가 최소값보다 작은 경우 최소값으로 설정
          if (draggingLeft.current < startLeft - scrollLeft - scroll) {
            draggingLeft.current = startLeft - scrollLeft - scroll;
          }
        }
        rowRnd.current.updateLeft(draggingLeft.current);
        const time = parserPixelToTime(draggingLeft.current + scrollLeft, {
          startLeft,
          scale,
          scaleWidth,
        });
        setCursor({ time });
        onCursorDrag && onCursorDrag(time);
        return false;
      }}
    >
      <div className={prefix("cursor")}>
        <svg
          className={prefix("cursor-top")}
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
        >
          <path
            d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1V9.38197C8 9.76074 7.786 10.107 7.44721 10.2764L4.44721 11.7764C4.16569 11.9172 3.83431 11.9172 3.55279 11.7764L0.552786 10.2764C0.214002 10.107 0 9.76074 0 9.38197V1Z"
            fill="#5297FF"
          />
        </svg>
        <div className={prefix("cursor-area")} />
      </div>
    </RowDnd>
  );
};
