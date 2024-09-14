import { useState } from "react";

import {
  TimelineRow,
  TimelineSegment,
} from "@/libs/react-timeline-editor/interface/segment";
import {
  parserSegmentsToPositions,
  parserTimeToTransform,
} from "../../../utils/deal_data";
import { DragLineData } from "../drag_lines";

export function useDragLine() {
  const [dragLineData, setDragLineData] = useState<DragLineData>({
    isMoving: false,
    movePositions: [],
    assistPositions: [],
  });

  /** 获取辅助线 */
  const defaultGetAssistPosition = (data: {
    editorData: TimelineRow[];
    assistSegmentIds?: string[];
    segment: TimelineSegment;
    row: TimelineRow;
    startLeft: number;
    scale: number;
    scaleWidth: number;
    hideCursor: boolean;
    cursorLeft: number;
  }) => {
    const {
      editorData,
      assistSegmentIds,
      segment,
      row,
      scale,
      scaleWidth,
      startLeft,
      cursorLeft,
      hideCursor,
    } = data;
    const otherSegments: TimelineSegment[] = [];
    if (assistSegmentIds) {
      editorData.forEach((rowItem) => {
        rowItem.segments.forEach((segmentItem) => {
          if (assistSegmentIds.includes(segmentItem.id))
            otherSegments.push(segmentItem);
        });
      });
    } else {
      editorData.forEach((rowItem) => {
        if (rowItem.id !== row.id) {
          otherSegments.push(...rowItem.segments);
        } else {
          rowItem.segments.forEach((segmentItem) => {
            if (segmentItem.id !== segment.id) otherSegments.push(segmentItem);
          });
        }
      });
    }

    const positions = parserSegmentsToPositions(otherSegments, {
      startLeft,
      scale,
      scaleWidth,
    });
    if (!hideCursor) positions.push(cursorLeft);

    return positions;
  };

  /** 获取当前移动标记 */
  const defaultGetMovePosition = (data: {
    start: number;
    end: number;
    dir?: "right" | "left";
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }) => {
    const { start, end, dir, scale, scaleWidth, startLeft } = data;
    const { left, width } = parserTimeToTransform(
      { start, end },
      { startLeft, scaleWidth, scale }
    );
    if (!dir) return [left, left + width];
    return dir === "right" ? [left + width] : [left];
  };

  /** 初始化draglines */
  const initDragLine = (data: {
    movePositions?: number[];
    assistPositions?: number[];
  }) => {
    const { movePositions, assistPositions } = data;

    setDragLineData({
      isMoving: true,
      movePositions: movePositions || [],
      assistPositions: assistPositions || [],
    });
  };

  /** 更新dragline */
  const updateDragLine = (data: {
    movePositions?: number[];
    assistPositions?: number[];
  }) => {
    const { movePositions, assistPositions } = data;
    setDragLineData((pre) => ({
      ...pre,
      movePositions: movePositions || pre.movePositions,
      assistPositions: assistPositions || pre.assistPositions,
    }));
  };

  /** 释放draglines */
  const disposeDragLine = () => {
    setDragLineData({
      isMoving: false,
      movePositions: [],
      assistPositions: [],
    });
  };

  return {
    initDragLine,
    updateDragLine,
    disposeDragLine,
    dragLineData,
    defaultGetAssistPosition,
    defaultGetMovePosition,
  };
}
