import useOptionStore from "@/app/store/OptionStore";
import { FC, useEffect, useRef, useState } from "react";
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from "react-virtualized";
import { CommonProp } from "../../interface/common_prop";
import {
  ROW_HEADER_DEFAULT_WIDTH,
  TIME_AREA_DEFAULT_HEIGHT,
} from "../../interface/const";
import useScrollStore from "../../store/ScrollStore";
import { prefix } from "../../utils/deal_class_prefix";
import { parserPixelToTime } from "../../utils/deal_data";

/** 애니메이션 타임라인 컴포넌트의 매개변수 */
export type TimeAreaProps = CommonProp & {
  /** 좌측 스크롤 거리 */
  scrollLeft: number;
  /** 스크롤 콜백, 스크롤을 동기화하는 데 사용됨 */
  onScroll: (params: OnScrollParams) => void;
  /** 커서 위치 설정 */
  setCursor: (param: { left?: number; time?: number }) => void;

  onDragTimeArea?: (start: number, end: number) => void;
};

/** 애니메이션 타임라인 컴포넌트 */
export const TimeArea: FC<TimeAreaProps> = ({
  setCursor,
  maxScaleCount,
  hideCursor,
  scaleCount,
  scrollLeft,
  onClickTimeArea,
  onDragTimeArea,
  getScaleRender,
}) => {
  const gridRef = useRef<Grid>();
  const { scale, scaleWidth, startLeft, scaleSplitCount } = useOptionStore(
    (state) => state.editorOption.scaleState
  );
  /** 세분화된 눈금을 표시할지 여부 */
  const showUnit = scaleSplitCount > 0;

  /** 각 셀의 렌더링 내용을 가져옴 */
  const cellRenderer: GridCellRenderer = ({ columnIndex, key, style }) => {
    const isShowScale = showUnit ? columnIndex % scaleSplitCount === 0 : true;
    const classNames = ["time-unit"];
    if (isShowScale) classNames.push("time-unit-big");
    const item =
      (showUnit ? columnIndex / scaleSplitCount : columnIndex) * scale;
    return (
      <div key={key} style={style} className={prefix(...classNames)}>
        {isShowScale && (
          <div className={prefix("time-unit-scale")}>
            {getScaleRender ? getScaleRender(item) : item}
          </div>
        )}
      </div>
    );
  };

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  /** 드래그 시작 처리 */
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientX - rect.x;
    const left = Math.max(position + scrollLeft, startLeft);

    setDragStart(left);
    setDragEnd(null);
    setDragging(true);
  };

  /** 드래그 중 처리 */
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientX - rect.x;
    const left = Math.max(position + scrollLeft, startLeft);

    const cursorTime = parserPixelToTime(left, {
      startLeft,
      scale,
      scaleWidth,
    });
    useScrollStore.setState({
      timelineCursorHoverTime: cursorTime,
    });

    if (!dragging) return;
    setDragEnd(left);

    if (dragStart !== null) {
      const startTime = parserPixelToTime(dragStart, {
        startLeft,
        scale,
        scaleWidth,
      });
      const endTime = parserPixelToTime(left, {
        startLeft,
        scale,
        scaleWidth,
      });
      const isRealDrag = checkRealDrag(dragStart, dragEnd);
      if (onDragTimeArea && isRealDrag) {
        if (startTime > endTime) {
          onDragTimeArea(endTime, startTime);
        } else {
          onDragTimeArea(startTime, endTime);
        }
      }
    }
  };

  /** 드래그 종료 처리 */
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientX - rect.x;
    const left = Math.max(position + scrollLeft, startLeft);

    setDragging(false);

    if (dragStart !== null) {
      const startTime = parserPixelToTime(dragStart, {
        startLeft,
        scale,
        scaleWidth,
      });
      const endTime = parserPixelToTime(left, { startLeft, scale, scaleWidth });
      const isRealDrag = checkRealDrag(dragStart, dragEnd);
      if (isRealDrag) {
        if (startTime > endTime) {
          onDragTimeArea?.(endTime, startTime);
        } else {
          onDragTimeArea?.(startTime, endTime);
        }
      } else {
        onDragTimeArea?.(undefined, undefined);
      }
    }
  };

  const handleMouseLeave = () => {
    useScrollStore.setState({
      timelineCursorHoverTime: undefined,
    });
  };

  useEffect(() => {
    gridRef.current?.recomputeGridSize();
  }, [scaleWidth, startLeft, scaleSplitCount, scaleCount]);

  /** 각 열의 너비를 가져옴 */
  const getColumnWidth = (data: { index: number }) => {
    switch (data.index) {
      case 0:
        return startLeft;
      default:
        return showUnit ? scaleWidth / scaleSplitCount : scaleWidth;
    }
  };
  const estColumnWidth = getColumnWidth({ index: 1 });
  return (
    <div
      className="absolute top-0 "
      style={{
        left: ROW_HEADER_DEFAULT_WIDTH,
        width: `calc(100% - ${ROW_HEADER_DEFAULT_WIDTH}px)`,
      }}
    >
      <AutoSizer>
        {({ width, height: audioSizerHeight }) => {
          const height = TIME_AREA_DEFAULT_HEIGHT || audioSizerHeight;
          return (
            <>
              <Grid
                className="!overflow-hidden"
                ref={gridRef}
                columnCount={
                  showUnit ? scaleCount * scaleSplitCount + 1 : scaleCount
                }
                columnWidth={getColumnWidth}
                estimatedColumnSize={estColumnWidth}
                rowCount={1}
                rowHeight={height}
                width={width}
                height={height}
                overscanRowCount={0}
                overscanColumnCount={10}
                cellRenderer={cellRenderer}
                scrollLeft={scrollLeft}
              ></Grid>
              <div
                className="absolute top-0 left-0"
                id="time-area-interact"
                style={{ width, height }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                  const isRealDrag = checkRealDrag(dragStart, dragEnd);

                  if (hideCursor || isRealDrag) return;

                  const rect = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  const position = e.clientX - rect.x;
                  const left = Math.max(position + scrollLeft, startLeft);
                  if (
                    left >
                    maxScaleCount * scaleWidth + startLeft - scrollLeft
                  )
                    return;

                  const time = parserPixelToTime(left, {
                    startLeft,
                    scale,
                    scaleWidth,
                  });
                  const result = onClickTimeArea && onClickTimeArea(time, e);
                  if (result === false) return; // false를 반환하면 시간 설정을 중단함
                  setCursor({ time });
                }}
              ></div>
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};

const checkRealDrag = (dragStart: number | null, dragEnd: number | null) => {
  return dragStart && dragEnd && Math.abs(dragStart - dragEnd) > 20;
};
