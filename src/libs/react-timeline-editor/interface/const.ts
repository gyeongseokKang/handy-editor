export const PREFIX = `timeline-editor`;

/** 시작 시 커서 위치한 시간 */
export const START_CURSOR_TIME = 0;
/** 기본 스케일 */
export const DEFAULT_SCALE = 1;
/** 기본 스케일 분할 개수 */
export const DEFAULT_SCALE_SPLIT_COUNT = 10;

/** 기본 스케일 표시 너비 */
export const DEFAULT_SCALE_WIDTH = 160;
/** 기본 스케일의 왼쪽 시작 거리 */
export const DEFAULT_START_LEFT = 20;
/** 기본 이동 최소 픽셀 */
export const DEFAULT_MOVE_GRID = 1;
/** 기본 흡착 픽셀 */
export const DEFAULT_ADSORPTION_DISTANCE = 8;
/** 기본 액션 행 높이 */
export const DEFAULT_ROW_HEIGHT = 50;

/** 최소 스케일 개수 */
export const MIN_SCALE_COUNT = 20;
/** 스케일을 추가할 때마다 추가되는 개수 */
export const ADD_SCALE_COUNT = 5;

export const EDIT_ARED_DEFAULT_MARGIN_TOP = 10;
export const TIME_AREA_DEFAULT_HEIGHT = 32;
export const ROW_HEADER_DEFAULT_WIDTH = 100;

/** 오류 메시지 */
export const ERROR = {
  START_TIME_LESS_THEN_ZERO: "액션 시작 시간이 0보다 작을 수 없습니다!",
  END_TIME_LESS_THEN_START_TIME:
    "액션 종료 시간이 시작 시간보다 작을 수 없습니다!",
};
