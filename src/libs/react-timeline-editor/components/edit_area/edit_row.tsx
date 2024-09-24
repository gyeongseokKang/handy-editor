import React, { FC } from "react";
import { CommonProp } from "../../interface/common_prop";

import { TimelineRow } from "../../interface/segment";
import { DataStoreUtil } from "../../store/DataStore";
import { prefix } from "../../utils/deal_class_prefix";
import { parserPixelToTime } from "../../utils/deal_data";
import { DragLineData } from "./drag_lines";
import { EditSegment } from "./edit_action";

export type EditRowProps = CommonProp & {
  areaRef: React.MutableRefObject<HTMLDivElement>;
  rowData?: TimelineRow;
  style?: React.CSSProperties;
  dragLineData: DragLineData;
  /** 距离左侧滚动距离 */
  scrollLeft: number;
  /** 设置scroll left */
  deltaScrollLeft: (scrollLeft: number) => void;
};

export const EditRow: FC<EditRowProps> = (props) => {
  const {
    rowData,
    style = {},
    onClickRow,
    onDoubleClickRow,
    onContextMenuRow,
    areaRef,
    scrollLeft,
    startLeft,
    scale,
    scaleWidth,
  } = props;

  const classNames = ["edit-row"];
  if (rowData?.selected) classNames.push("edit-row-selected");

  const handleTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const position = e.clientX - rect.x;
    const left = position + scrollLeft;
    const time = parserPixelToTime(left, { startLeft, scale, scaleWidth });
    return time;
  };

  return (
    <div
      className={`${prefix(...classNames)} ${(rowData?.classNames || []).join(
        " "
      )} z-10 hover:bg-zinc-800`}
      style={style}
      onClick={(e) => {
        DataStoreUtil.selectSegment(undefined);
        if (rowData && onClickRow) {
          const time = handleTime(e);
          onClickRow(e, { row: rowData, time: time });
        }
      }}
      onDoubleClick={(e) => {
        if (rowData && onDoubleClickRow) {
          const time = handleTime(e);
          onDoubleClickRow(e, { row: rowData, time: time });
        }
      }}
      onContextMenu={(e) => {
        if (rowData && onContextMenuRow) {
          const time = handleTime(e);
          onContextMenuRow(e, { row: rowData, time: time });
        }
      }}
    >
      {(rowData?.segments || []).map((segment) => (
        <EditSegment
          key={segment.id}
          {...props}
          handleTime={handleTime}
          row={rowData}
          segment={segment}
        />
      ))}
    </div>
  );
};
