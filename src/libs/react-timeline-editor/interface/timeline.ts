import React, { ReactNode } from "react";
import { OnScrollParams } from "react-virtualized";
import { ITimelineEngine } from "..";
import { Emitter } from "../engine/emitter";
import { EventTypes } from "../engine/events";
import { TimelineEffect } from "./effect";
import { TimelineRow, TimelineSegment } from "./segment";

export * from "./effect";

export interface EditData {
  /**
   * @description 시간축 편집 데이터
   */
  editorData: TimelineRow[];
  /**
   * @description 시간축 동작 및 효과 맵
   */
  effects: Record<string, TimelineEffect>;
  /**
   * @description 단일 눈금 범위 (>0)
   * @default 1
   */
  scale?: number;
  /**
   * @description 최소 눈금 개수 (>=1)
   * @default 20
   */
  minScaleCount?: number;
  /**
   * @description 최대 눈금 개수 (>=minScaleCount)
   * @default Infinity
   */
  maxScaleCount?: number;
  /**
   * @description 단일 눈금의 세부 단위 수 (>0 정수)
   * @default 10
   */
  scaleSplitCount?: number;
  /**
   * @description 단일 눈금의 표시 너비 (>0, 단위: px)
   * @default 160
   */
  scaleWidth?: number;
  /**
   * @description 눈금 시작 지점이 왼쪽으로부터의 거리 (>=0, 단위: px)
   * @default 20
   */
  startLeft?: number;
  /**
   * @description 각 편집 행의 기본 높이 (>0, 단위: px)
   * @default 32
   */
  rowHeight?: number;
  /**
   * @description 그리드 스냅을 활성화할지 여부
   * @default false
   */
  gridSnap?: boolean;
  /**
   * @description 드래그 시 보조선을 스냅할지 여부
   * @default false
   */
  dragLine?: boolean;
  /**
   * @description 커서를 숨길지 여부
   * @default false
   */
  hideCursor?: boolean;
  /**
   * @description 모든 동작 영역에서 드래그를 금지할지 여부
   * @default false
   */
  disableDrag?: boolean;
  /**
   * @description 타임라인 엔진을 지정하지 않으면 내장 엔진을 사용
   */
  engine?: ITimelineEngine;
  /**
   * @description 사용자 정의 동작 영역 렌더링
   */
  getSegmentRender?: (
    segment: TimelineSegment,
    row: TimelineRow,
    { isDragging, isResizing }: { isDragging: boolean; isResizing: boolean }
  ) => ReactNode;
  /**
   * @description 사용자 정의 눈금 렌더링
   */
  getScaleRender?: (scale: number) => ReactNode;
  /**
   * @description 동작이 시작될 때의 콜백 함수
   */
  onSegmentMoveStart?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
  }) => void;
  /**
   * @description 동작 중 콜백 함수 (false를 반환하면 이동을 차단)
   */
  onSegmentMoving?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
    start: number;
    end: number;
  }) => void | boolean;
  /**
   * @description 동작이 끝날 때의 콜백 함수 (false를 반환하면 onChange가 호출되지 않음)
   */
  onSegmentMoveEnd?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
    start: number;
    end: number;
  }) => void;
  /**
   * @description 크기 조정이 시작될 때의 콜백 함수
   */
  onSegmentResizeStart?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
    dir: "right" | "left";
  }) => void;
  /**
   * @description 크기 조정 중 콜백 함수 (false를 반환하면 크기 조정을 차단)
   */
  onSegmentResizing?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
    start: number;
    end: number;
    dir: "right" | "left";
  }) => void | boolean;
  /**
   * @description 크기 조정이 끝날 때의 콜백 함수 (false를 반환하면 onChange가 호출되지 않음)
   */
  onSegmentResizeEnd?: (params: {
    segment: TimelineSegment;
    row: TimelineRow;
    start: number;
    end: number;
    dir: "right" | "left";
  }) => void;
  /**
   * @description 행을 클릭할 때의 콜백 함수
   */
  onClickRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 동작을 클릭할 때의 콜백 함수
   */
  onClickSegment?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      segment: TimelineSegment;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 동작을 클릭할 때의 콜백 함수 (드래그가 발생할 때는 실행되지 않음)
   */
  onClickSegmentOnly?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      segment: TimelineSegment;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 행을 더블 클릭할 때의 콜백 함수
   */
  onDoubleClickRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 동작을 더블 클릭할 때의 콜백 함수
   */
  onDoubleClickSegment?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      segment: TimelineSegment;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 행을 우클릭할 때의 콜백 함수
   */
  onContextMenuRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 동작을 우클릭할 때의 콜백 함수
   */
  onContextMenuSegment?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      segment: TimelineSegment;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 이동/크기 조정 시작 시 드래그 보조선을 표시할 segment id 목록을 가져옴. 기본적으로 현재 이동 중인 동작을 제외한 모든 동작을 가져옴.
   */
  getAssistDragLineSegmentIds?: (params: {
    segment: TimelineSegment;
    editorData: TimelineRow[];
    row: TimelineRow;
  }) => string[];
  /**
   * @description 커서가 드래그를 시작할 때의 이벤트
   */
  onCursorDragStart?: (time: number) => void;
  /**
   * @description 커서가 드래그를 끝낼 때의 이벤트
   */
  onCursorDragEnd?: (time: number) => void;
  /**
   * @description 커서가 드래그될 때의 이벤트
   */
  onCursorDrag?: (time: number) => void;
  /**
   * @description 시간 영역을 클릭할 때의 이벤트, false를 반환하면 시간 설정을 방지
   */
  onClickTimeArea?: (
    time: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => boolean | undefined;
}

export interface TimelineState {
  /** DOM 노드 */
  target: HTMLElement;
  /** 실행 리스너 */
  listener: Emitter<EventTypes>;
  /** 재생 중인지 여부 */
  isPlaying: boolean;
  /** 일시 정지 중인지 여부 */
  isPaused: boolean;
  /** 현재 재생 시간을 설정 */
  setTime: (time: number) => void;
  /** 현재 재생 시간을 가져오기 */
  getTime: () => number;
  /** 재생 속도 설정 */
  setPlayRate: (rate: number) => void;
  /** 재생 속도 가져오기 */
  getPlayRate: () => number;
  /** 현재 시간을 다시 렌더링 */
  reRender: () => void;
  /** 재생 */
  play: (param: {
    /** 기본적으로 처음부터 끝까지 실행, autoEnd보다 우선 */
    toTime?: number;
    /** 재생이 끝난 후 자동 종료할지 여부 */
    autoEnd?: boolean;
    /** 실행할 segmentId 목록, 제공되지 않으면 기본적으로 모두 실행 */
    runSegmentIds?: string[];
  }) => boolean;
  /** 일시 정지 */
  pause: () => void;
  /** 정지 */
  stop: () => void;
  /** 스크롤 좌측 위치 설정 */
  setScrollLeft: (val: number) => void;
  /** 스크롤 상단 위치 설정 */
  setScrollTop: (val: number) => void;

  /** 루프 설정 */
  setLoop: (start: number, end: number) => void;
}

/**
 * 애니메이션 편집기 매개변수
 * @export
 * @interface TimelineProp
 */
export interface TimelineEditor extends EditData {
  /**
   * @description 편집 영역의 상단 스크롤 거리 (ref.setScrollTop을 사용해주세요)
   * @deprecated
   */
  scrollTop?: number;
  /**
   * @description 편집 영역 스크롤 콜백 (편집 행과의 스크롤 동기화를 위해 사용)
   */
  onScroll?: (params: OnScrollParams) => void;
  /**
   * @description 드래그 중 자동 스크롤을 활성화할지 여부
   * @default false
   */
  autoScroll?: boolean;
  /**
   * @description 사용자 정의 타임라인 스타일
   */
  style?: React.CSSProperties;
  /**
   * @description 데이터 변경 시 자동으로 다시 렌더링할지 여부 (데이터 변경 또는 커서 시간 변경 시 업데이트됨)
   * @default true
   */
  autoReRender?: boolean;
  /**
   * @description 데이터 변경 콜백, 동작이 끝나고 데이터가 변경된 후 호출됨 (false를 반환하면 엔진 동기화를 방지하여 성능 오버헤드를 줄일 수 있음)
   */
  onChange?: (editorData: TimelineRow[]) => void | boolean;
}

export interface ScaleState {
  scale: number;
  scaleWidth: number;
  startLeft: number;
  scaleSplitCount: number;
}
