/**
 * 동작 행 기본 매개변수
 * @export
 * @interface TimelineRow
 */
export interface TimelineRow {
  /** 동작 행 id */
  id: string;
  /** 행의 동작 리스트 */
  segments: TimelineSegment[];
  /** 사용자 정의 행 높이 */
  rowHeight?: number;
  /** 행이 선택되었는지 여부 */
  selected?: boolean;
  /** 행의 추가 클래스명 */
  classNames?: string[];
}

/**
 * 동작의 기본 매개변수
 * @export
 * @interface TimelineSegmentBase
 */
export interface TimelineSegmentBase {
  /** 동작 id */
  id: string;
  /** 동작 시작 시간 */
  start: number;
  /** 동작 종료 시간 */
  end: number;
  /** 동작에 해당하는 effectId */
  effectId: string;

  /** 동작이 선택되었는지 여부 */
  selected?: boolean;
  /** 동작이 확장 가능한지 여부 */
  flexible?: boolean;
  /** 동작이 이동 가능한지 여부 */
  movable?: boolean;
  /** 동작이 실행 금지인지 여부 */
  disable?: boolean;

  /** 동작의 최소 시작 시간 제한 */
  minStart?: number;
  /** 동작의 최대 종료 시간 제한 */
  maxEnd?: number;

  /** 동작dml 드래그 여부*/
  isDragging?: boolean;
}

export interface AudioPlayerSegment extends TimelineSegmentBase {
  data: {
    src: string;
    name: string;
  };
}

export interface VideoPlayerSegment extends TimelineSegmentBase {
  data: {
    src: string;
    videoSrc: string;
    name: string;
  };
}

export type TimelineSegment =
  | TimelineSegmentBase
  | AudioPlayerSegment
  | VideoPlayerSegment;
