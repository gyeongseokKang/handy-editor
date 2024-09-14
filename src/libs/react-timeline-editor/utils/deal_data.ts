import { ADD_SCALE_COUNT } from "../interface/const";
import { TimelineRow, TimelineSegment } from "../interface/segment";
/** 시간 -> 픽셀 변환 */
export function parserTimeToPixel(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return startLeft + (data / scale) * scaleWidth;
}

/** 픽셀 -> 시간 변환 */
export function parserPixelToTime(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return ((data - startLeft) / scaleWidth) * scale;
}

/** 위치 + 너비 -> 시작 + 끝 시간 변환 */
export function parserTransformToTime(
  data: {
    left: number;
    width: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { left, width } = data;
  const start = parserPixelToTime(left, param);
  const end = parserPixelToTime(left + width, param);
  return {
    start,
    end,
  };
}

/** 시작 + 끝 시간 -> 위치 + 너비 변환 */
export function parserTimeToTransform(
  data: {
    start: number;
    end: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { start, end } = data;
  const left = parserTimeToPixel(start, param);
  const width = parserTimeToPixel(end, param) - left;
  return {
    left,
    width,
  };
}

/** 데이터에 따라 눈금 개수 가져오기 */
export function getScaleCountByRows(
  data: TimelineRow[],
  param: { scale: number }
) {
  let max = 0;
  data.forEach((row) => {
    row.segments.forEach((segment) => {
      max = Math.max(max, segment.end);
    });
  });
  const count = Math.ceil(max / param.scale);
  return count + ADD_SCALE_COUNT;
}

/** 시간에 따른 현재 눈금 개수 가져오기 */
export function getScaleCountByPixel(
  data: number,
  param: {
    startLeft: number;
    scaleWidth: number;
    scaleCount: number;
  }
) {
  const { startLeft, scaleWidth } = param;
  const count = Math.ceil((data - startLeft) / scaleWidth);
  return Math.max(count + ADD_SCALE_COUNT, param.scaleCount);
}

/** 동작의 모든 시간 위치를 위치 집합으로 변환 */
export function parserSegmentsToPositions(
  segments: TimelineSegment[],
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const positions: number[] = [];
  segments.forEach((item) => {
    positions.push(parserTimeToPixel(item.start, param));
    positions.push(parserTimeToPixel(item.end, param));
  });
  return positions;
}
