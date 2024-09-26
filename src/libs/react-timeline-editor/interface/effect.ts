import { TimelineEngine } from "../engine/engine";
import { TimelineSegment } from "./segment";

export interface TimelineEffect {
  /** 효과 id */
  id?: string;
  /** 효과 이름 */
  name?: string;
  /** 효과 실행 코드 */
  source?: TimeLineEffectSource;
}

export interface EffectSourceParam<
  TSegment = TimelineSegment,
  TEffect = TimelineEffect,
  TEngine = TimelineEngine
> {
  id?: string;
  /** 현재 시간 */
  time: number;
  /** 재생 중인지 여부 */
  isPlaying: boolean;
  /** 동작 */
  segment: TSegment;
  /** 동작 효과 */
  effect: TEffect;
  /** 실행 엔진 */
  engine: TEngine;
}
/**
 * 효과 실행 콜백
 * @export
 * @interface TimeLineEffectSource
 */
export interface TimeLineEffectSource {
  /** 현재 동작 시간 영역에서 재생이 시작될 때 콜백 */
  start?: (param: EffectSourceParam) => void;
  /** 시간이 동작에 진입할 때 콜백 */
  enter?: (param: EffectSourceParam) => void;
  /** 동작이 업데이트될 때 콜백 */
  update?: (param: EffectSourceParam) => void;
  /** 시간이 동작에서 벗어날 때 콜백 */
  leave?: (param: EffectSourceParam) => void;
  /** 현재 동작 시간 영역에서 재생이 멈출 때 콜백 */
  stop?: (param: EffectSourceParam) => void;
  /** segment가 로그될 때 콜백 */
  load?: (param: EffectSourceParam) => void;
}
