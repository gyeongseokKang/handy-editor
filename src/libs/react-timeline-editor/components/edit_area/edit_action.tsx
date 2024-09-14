import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { CommonProp } from "../../interface/common_prop";
import {
  DEFAULT_ADSORPTION_DISTANCE,
  DEFAULT_MOVE_GRID,
} from "../../interface/const";

import { TimelineRow, TimelineSegment } from "../../interface/segment";
import { prefix } from "../../utils/deal_class_prefix";
import {
  getScaleCountByPixel,
  parserTimeToPixel,
  parserTimeToTransform,
  parserTransformToTime,
} from "../../utils/deal_data";
import { RowDnd } from "../row_rnd/row_rnd";
import {
  RndDragCallback,
  RndDragEndCallback,
  RndDragStartCallback,
  RndResizeCallback,
  RndResizeEndCallback,
  RndResizeStartCallback,
  RowRndApi,
} from "../row_rnd/row_rnd_interface";
import { DragLineData } from "./drag_lines";

export type EditSegmentProps = CommonProp & {
  row: TimelineRow;
  segment: TimelineSegment;
  dragLineData: DragLineData;
  setEditorData: (params: TimelineRow[]) => void;
  handleTime: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => number;
  areaRef: React.MutableRefObject<HTMLDivElement>;
  /** 设置scroll left */
  deltaScrollLeft?: (delta: number) => void;
};

export const EditSegment: FC<EditSegmentProps> = ({
  editorData,
  row,
  segment,
  effects,
  rowHeight,
  scale,
  scaleWidth,
  scaleSplitCount,
  startLeft,
  gridSnap,
  disableDrag,

  scaleCount,
  maxScaleCount,
  setScaleCount,
  onSegmentMoveStart,
  onSegmentMoving,
  onSegmentMoveEnd,
  onSegmentResizeStart,
  onSegmentResizeEnd,
  onSegmentResizing,

  dragLineData,
  setEditorData,
  onClickSegment,
  onClickSegmentOnly,
  onDoubleClickSegment,
  onContextMenuSegment,
  getSegmentRender,
  handleTime,
  areaRef,
  deltaScrollLeft,
}) => {
  const rowRnd = useRef<RowRndApi>();
  const isDragWhenClick = useRef(false);
  const {
    id,
    maxEnd,
    minStart,
    end,
    start,
    selected,
    flexible = true,
    movable = true,
    effectId,
  } = segment;

  // 获取最大/最小 像素范围
  const leftLimit = parserTimeToPixel(minStart || 0, {
    startLeft,
    scale,
    scaleWidth,
  });
  const rightLimit = Math.min(
    maxScaleCount * scaleWidth + startLeft, // 根据maxScaleCount限制移动范围
    parserTimeToPixel(maxEnd || Number.MAX_VALUE, {
      startLeft,
      scale,
      scaleWidth,
    })
  );

  // 初始化动作坐标数据
  const [transform, setTransform] = useState(() => {
    return parserTimeToTransform(
      { start, end },
      { startLeft, scale, scaleWidth }
    );
  });

  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    setTransform(
      parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth })
    );
  }, [end, start, startLeft, scaleWidth, scale]);

  // 配置拖拽网格对其属性
  const gridSize = scaleWidth / scaleSplitCount;

  // 动作的名称
  const classNames = ["segment"];
  if (movable) classNames.push("segment-movable");
  if (selected) classNames.push("segment-selected");
  if (flexible) classNames.push("segment-flexible");
  if (effects[effectId]) classNames.push(`segment-effect-${effectId}`);

  /** 计算scale count */
  const handleScaleCount = (left: number, width: number) => {
    const curScaleCount = getScaleCountByPixel(left + width, {
      startLeft,
      scaleCount,
      scaleWidth,
    });
    if (curScaleCount !== scaleCount) setScaleCount(curScaleCount);
  };

  //#region [rgba(100,120,156,0.08)] 回调
  const handleDragStart: RndDragStartCallback = () => {
    setIsDragging(true);
    onSegmentMoveStart && onSegmentMoveStart({ segment, row });
  };
  const handleDrag: RndDragCallback = ({ left, width }) => {
    isDragWhenClick.current = true;

    if (onSegmentMoving) {
      const { start, end } = parserTransformToTime(
        { left, width },
        { scaleWidth, scale, startLeft }
      );
      const result = onSegmentMoving({ segment, row, start, end });
      if (result === false) return false;
    }
    setTransform({ left, width });
    handleScaleCount(left, width);
  };

  const handleDragEnd: RndDragEndCallback = ({ left, width }) => {
    setIsDragging(false);
    // 计算时间
    const { start, end } = parserTransformToTime(
      { left, width },
      { scaleWidth, scale, startLeft }
    );

    // 设置数据
    const rowItem = editorData.find((item) => item.id === row.id);
    const segment = rowItem.segments.find((item) => item.id === id);
    segment.start = start;
    segment.end = end;
    setEditorData(editorData);

    // 执行回调
    if (onSegmentMoveEnd) onSegmentMoveEnd({ segment, row, start, end });
  };

  const handleResizeStart: RndResizeStartCallback = (dir) => {
    onSegmentResizeStart && onSegmentResizeStart({ segment, row, dir });
  };

  const handleResizing: RndResizeCallback = (dir, { left, width }) => {
    isDragWhenClick.current = true;
    if (onSegmentResizing) {
      const { start, end } = parserTransformToTime(
        { left, width },
        { scaleWidth, scale, startLeft }
      );
      const result = onSegmentResizing({ segment, row, start, end, dir });
      if (result === false) return false;
    }
    setTransform({ left, width });
    handleScaleCount(left, width);
  };

  const handleResizeEnd: RndResizeEndCallback = (dir, { left, width }) => {
    // 计算时间
    const { start, end } = parserTransformToTime(
      { left, width },
      { scaleWidth, scale, startLeft }
    );

    // 设置数据
    const rowItem = editorData.find((item) => item.id === row.id);
    const segment = rowItem.segments.find((item) => item.id === id);
    segment.start = start;
    segment.end = end;
    setEditorData(editorData);

    // 触发回调
    if (onSegmentResizeEnd)
      onSegmentResizeEnd({ segment, row, start, end, dir });
  };
  //#endregion

  const nowSegment = {
    ...segment,
    ...parserTransformToTime(
      { left: transform.left, width: transform.width },
      { startLeft, scaleWidth, scale }
    ),
  };

  const nowRow: TimelineRow = {
    ...row,
    segments: [...row.segments],
  };
  if (row.segments.includes(segment)) {
    nowRow.segments[row.segments.indexOf(segment)] = nowSegment;
  }

  return (
    <RowDnd
      ref={rowRnd}
      parentRef={areaRef}
      start={startLeft}
      left={transform.left}
      width={transform.width}
      grid={(gridSnap && gridSize) || DEFAULT_MOVE_GRID}
      adsorptionDistance={
        gridSnap
          ? Math.max(
              (gridSize || DEFAULT_MOVE_GRID) / 2,
              DEFAULT_ADSORPTION_DISTANCE
            )
          : DEFAULT_ADSORPTION_DISTANCE
      }
      adsorptionPositions={dragLineData.assistPositions}
      bounds={{
        left: leftLimit,
        right: rightLimit,
      }}
      edges={{
        left: !disableDrag && flexible && `.${prefix("segment-left-stretch")}`,
        right:
          !disableDrag && flexible && `.${prefix("segment-right-stretch")}`,
      }}
      enableDragging={!disableDrag && movable}
      enableResizing={!disableDrag && flexible}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onResizeStart={handleResizeStart}
      onResize={handleResizing}
      onResizeEnd={handleResizeEnd}
      deltaScrollLeft={deltaScrollLeft}
    >
      <div
        onMouseDown={() => {
          isDragWhenClick.current = false;
        }}
        onClick={(e) => {
          let time: number;
          if (onClickSegment) {
            time = handleTime(e);
            onClickSegment(e, { row, segment, time: time });
          }
          if (!isDragWhenClick.current && onClickSegmentOnly) {
            if (!time) time = handleTime(e);
            onClickSegmentOnly(e, { row, segment, time: time });
          }
        }}
        onDoubleClick={(e) => {
          if (onDoubleClickSegment) {
            const time = handleTime(e);
            onDoubleClickSegment(e, { row, segment, time: time });
          }
        }}
        onContextMenu={(e) => {
          if (onContextMenuSegment) {
            const time = handleTime(e);
            onContextMenuSegment(e, { row, segment, time: time });
          }
        }}
        className={prefix((classNames || []).join(" "))}
        style={{ height: rowHeight }}
      >
        {getSegmentRender &&
          getSegmentRender(nowSegment, nowRow, {
            isDragging: isDragging,
          })}
        {flexible && <div className={prefix("segment-left-stretch")}></div>}
        {flexible && <div className={prefix("segment-right-stretch")} />}
      </div>
    </RowDnd>
  );
};
