/* eslint-disable react/display-name */
import useOptionStore from "@/app/media-editor/store/OptionStore";
import { cn } from "@/lib/utils";
import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  OnScrollParams,
} from "react-virtualized";
import { CommonProp } from "../../interface/common_prop";
import {
  EDIT_ARED_DEFAULT_HEIGHT,
  EDIT_ARED_DEFAULT_MARGIN_TOP,
} from "../../interface/const";

import { TimelineRow } from "../../interface/segment";
import { EditData } from "../../interface/timeline";
import { prefix } from "../../utils/deal_class_prefix";
import { parserTimeToPixel } from "../../utils/deal_data";
import { DragLines } from "./drag_lines";
import { EditRow } from "./edit_row";
import { useDragLine } from "./hooks/use_drag_line";
export type EditAreaProps = CommonProp & {
  /** 거리 왼쪽 스크롤 거리 */
  scrollLeft: number;
  /** 거리 상단 스크롤 거리 */
  scrollTop: number;
  /** 스크롤 콜백, 스크롤을 동기화하는 데 사용됨 */
  onScroll: (params: OnScrollParams) => void;
  /** 편집기 데이터 설정 */
  setEditorData: (params: TimelineRow[]) => void;
  /** scroll left 설정 */
  deltaScrollLeft: (scrollLeft: number) => void;
};

/** 편집 영역 ref 데이터 */
export interface EditAreaState {
  domRef: React.MutableRefObject<HTMLDivElement>;
}

export const EditArea = React.forwardRef<EditAreaState, EditAreaProps>(
  (props, ref) => {
    const {
      editorData,
      rowHeight,
      scaleCount,
      scrollLeft,
      scrollTop,
      hideCursor,
      cursorTime,
      onScroll,
      dragLine,
      getAssistDragLineSegmentIds,
      onSegmentMoveEnd,
      onSegmentMoveStart,
      onSegmentMoving,
      onSegmentResizeEnd,
      onSegmentResizeStart,
      onSegmentResizing,
    } = props;

    const { scale, scaleWidth, startLeft } = useOptionStore(
      (state) => state.editorOption.scaleState
    );

    const {
      dragLineData,
      initDragLine,
      updateDragLine,
      disposeDragLine,
      defaultGetAssistPosition,
      defaultGetMovePosition,
    } = useDragLine();
    const editAreaRef = useRef<HTMLDivElement>();
    const gridRef = useRef<Grid>();
    const heightRef = useRef(-1);

    // ref 데이터
    useImperativeHandle(ref, () => ({
      get domRef() {
        return editAreaRef;
      },
    }));

    const handleInitDragLine: EditData["onSegmentMoveStart"] = (data) => {
      if (dragLine) {
        const assistSegmentIds =
          getAssistDragLineSegmentIds &&
          getAssistDragLineSegmentIds({
            segment: data.segment,
            row: data.row,
            editorData,
          });
        const cursorLeft = parserTimeToPixel(cursorTime, {
          scaleWidth,
          scale,
          startLeft,
        });
        const assistPositions = defaultGetAssistPosition({
          editorData,
          assistSegmentIds,
          segment: data.segment,
          row: data.row,
          scale,
          scaleWidth,
          startLeft,
          hideCursor,
          cursorLeft,
        });
        initDragLine({ assistPositions });
      }
    };

    const handleUpdateDragLine: EditData["onSegmentMoving"] = (data) => {
      if (dragLine) {
        const movePositions = defaultGetMovePosition({
          ...data,
          startLeft,
          scaleWidth,
          scale,
        });
        updateDragLine({ movePositions });
      }
    };

    /** 각 cell의 렌더링 내용을 가져옴 */
    const cellRenderer: GridCellRenderer = ({ rowIndex, key, style }) => {
      const row = editorData[rowIndex]; // 행 데이터
      return (
        <EditRow
          {...props}
          style={{
            ...style,
            backgroundPositionX: `0, ${startLeft}px`,
            backgroundSize: `${startLeft}px, ${scaleWidth}px`,
          }}
          areaRef={editAreaRef}
          key={key}
          rowHeight={row?.rowHeight || rowHeight}
          rowData={row}
          dragLineData={dragLineData}
          onSegmentMoveStart={(data) => {
            handleInitDragLine(data);
            return onSegmentMoveStart && onSegmentMoveStart(data);
          }}
          onSegmentResizeStart={(data) => {
            handleInitDragLine(data);

            return onSegmentResizeStart && onSegmentResizeStart(data);
          }}
          onSegmentMoving={(data) => {
            handleUpdateDragLine(data);
            return onSegmentMoving && onSegmentMoving(data);
          }}
          onSegmentResizing={(data) => {
            handleUpdateDragLine(data);
            return onSegmentResizing && onSegmentResizing(data);
          }}
          onSegmentResizeEnd={(data) => {
            disposeDragLine();
            return onSegmentResizeEnd && onSegmentResizeEnd(data);
          }}
          onSegmentMoveEnd={(data) => {
            disposeDragLine();
            return onSegmentMoveEnd && onSegmentMoveEnd(data);
          }}
        />
      );
    };

    useLayoutEffect(() => {
      gridRef.current?.scrollToPosition({ scrollTop, scrollLeft });
    }, [scrollTop, scrollLeft]);

    useEffect(() => {
      gridRef.current.recomputeGridSize();
    }, [editorData]);

    return (
      <div
        ref={editAreaRef}
        className={cn(prefix("edit-area"), "relative flex-auto")}
        style={{
          marginTop: EDIT_ARED_DEFAULT_MARGIN_TOP,
          minHeight: EDIT_ARED_DEFAULT_HEIGHT,
        }}
      >
        <AutoSizer>
          {({ width, height }) => {
            // 전체 높이 가져오기
            let totalHeight = 0;
            // 높이 목록
            const heights = editorData.map((row) => {
              const itemHeight = row.rowHeight || rowHeight;
              totalHeight += itemHeight;
              return itemHeight;
            });

            if (totalHeight < height) {
              heights.push(height - totalHeight);
              if (heightRef.current !== height && heightRef.current >= 0) {
                setTimeout(() =>
                  gridRef.current?.recomputeGridSize({
                    rowIndex: heights.length - 1,
                  })
                );
              }
            }
            heightRef.current = height;
            return (
              <Grid
                columnCount={1}
                rowCount={heights.length}
                ref={gridRef}
                cellRenderer={cellRenderer}
                columnWidth={Math.max(
                  scaleCount * scaleWidth + startLeft,
                  width
                )}
                width={width}
                height={height + 20}
                rowHeight={({ index }) => heights[index] || rowHeight}
                overscanRowCount={10}
                overscanColumnCount={0}
                onScroll={(param) => {
                  onScroll(param);
                }}
              />
            );
          }}
        </AutoSizer>
        {dragLine && <DragLines scrollLeft={scrollLeft} {...dragLineData} />}
      </div>
    );
  }
);
