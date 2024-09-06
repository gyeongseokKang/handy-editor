import { TimelineAction, TimelineRow } from "../interface/action";
import { TimelineEffect } from "../interface/effect";
import { Emitter } from "./emitter";
import { Events, EventTypes } from "./events";

const PLAYING = "playing";
const PAUSED = "paused";
type PlayState = "playing" | "paused";

export interface ITimelineEngine extends Emitter<EventTypes> {
  readonly isPlaying: boolean;
  readonly isPaused: boolean;
  effects: Record<string, TimelineEffect>;
  data: TimelineRow[];
  /** 플레이 속도 설정 */
  setPlayRate(rate: number): boolean;
  /** 플레이 속도 가져오기 */
  getPlayRate(): number;
  /** 현재 시간을 다시 렌더링 */
  reRender(): void;
  /** 플레이 시간 설정 */
  setTime(time: number, isTick?: boolean): boolean;
  /** 루프 설정 */
  setLoop(start: number, end: number): boolean;
  /** 플레이 시간 가져오기 */
  getTime(): number;
  /** 재생 */
  play(param: {
    /** 기본적으로 처음부터 끝까지 실행, autoEnd보다 우선 */
    toTime?: number;
    /** 재생이 끝난 후 자동 종료할지 여부 */
    autoEnd?: boolean;
  }): boolean;
  /** 일시 정지 */
  pause(): void;
  /** 정지 */
  stop(): void;
}

/**
 * 타임라인 플레이어
 * 에디터와 독립적으로 실행 가능
 * @export
 * @class TimelineEngine
 * @extends {Emitter<EventTypes>}
 */
export class TimelineEngine
  extends Emitter<EventTypes>
  implements ITimelineEngine
{
  constructor() {
    super(new Events());
  }

  /** requestAnimationFrame timerId */
  private _timerId: number;

  /** 플레이 속도 */
  private _playRate = 1;
  /** 현재 시간 */
  private _currentTime: number = 0;
  /** 플레이 상태 */
  private _playState: PlayState = "paused";
  /** 이전 프레임의 시간 데이터 */
  private _prev: number;

  /** 액션 효과 맵 */
  private _effectMap: Record<string, TimelineEffect> = {};
  /** 실행할 액션 맵 */
  private _actionMap: Record<string, TimelineAction> = {};
  /** 액션 시작 시간 순서대로 정렬된 액션 ID 배열 */
  private _actionSortIds: string[] = [];

  /** 현재 순회 중인 액션 인덱스 */
  private _next: number = 0;
  /** 현재 시간이 포함된 액션 ID 목록 */
  private _activeActionIds: string[] = [];

  /** 루프 모드 설정 */
  private _loopStart: number | null = null;
  private _loopEnd: number | null = null;
  private _isLooping: boolean = false;

  /**

  /** 재생 중인지 여부 */
  get isPlaying() {
    return this._playState === "playing";
  }
  /** 일시 정지 중인지 여부 */
  get isPaused() {
    return this._playState === "paused";
  }

  set effects(effects: Record<string, TimelineEffect>) {
    this._effectMap = effects;
  }
  set data(data: TimelineRow[]) {
    if (this.isPlaying) this.pause();
    this._dealData(data);
    this._dealClear();
    this._dealEnter(this._currentTime);
  }

  /**
   * 플레이 속도 설정
   * @memberof TimelineEngine
   */
  setPlayRate(rate: number): boolean {
    if (rate <= 0) {
      console.error("오류: 속도는 0보다 작을 수 없습니다!");
      return;
    }
    const result = this.trigger("beforeSetPlayRate", { rate, engine: this });
    if (!result) return false;
    this._playRate = rate;
    this.trigger("afterSetPlayRate", { rate, engine: this });

    return true;
  }
  /**
   * 플레이 속도 가져오기
   * @memberof TimelineEngine
   */
  getPlayRate() {
    return this._playRate;
  }

  /**
   * 현재 시간을 다시 렌더링
   * @return {*}
   * @memberof TimelineEngine
   */
  reRender() {
    if (this.isPlaying) return;
    this._tickAction(this._currentTime);
  }

  /**
   * 플레이 시간 설정
   * @param {number} time
   * @param {boolean} [isTick] tick로 인해 호출되었는지 여부
   * @memberof TimelineEngine
   */
  setTime(time: number, isTick?: boolean): boolean {
    const result =
      isTick || this.trigger("beforeSetTime", { time, engine: this });
    if (!result) return false;

    this._currentTime = time;

    this._next = 0;
    this._dealLeave(time);
    this._dealEnter(time);

    if (isTick) this.trigger("setTimeByTick", { time, engine: this });
    else this.trigger("afterSetTime", { time, engine: this });
    return true;
  }
  /**
   * 루프 설정
   * @param {number} start 루프 시작 시간
   * @param {number} end 루프 종료 시간
   */
  setLoop(start: number, end: number): boolean {
    if (start === undefined || end === undefined) {
      return;
    }
    if (start >= end) {
      console.error("오류: 루프 시작 시간은 종료 시간보다 작아야 합니다.");
      return false;
    }

    this._loopStart = start;
    this._loopEnd = end;
    this._isLooping = true;

    return true;
  }

  /**
   * 루프 모드 종료
   */
  clearLoop(): void {
    this._loopStart = null;
    this._loopEnd = null;
    this._isLooping = false;
  }
  /**
   * 현재 시간 가져오기
   * @return {*}  {number}
   * @memberof TimelineEngine
   */
  getTime(): number {
    return this._currentTime;
  }

  /**
   * 재생: 시작 시간은 현재 time
   * @param param
   * @return {boolean} {boolean}
   */
  play(param: {
    /** 기본적으로 처음부터 끝까지 실행, autoEnd보다 우선 */
    toTime?: number;
    /** 재생이 끝난 후 자동 종료할지 여부 */
    autoEnd?: boolean;
  }): boolean {
    const { toTime, autoEnd = true } = param;

    const currentTime = this.getTime();
    /** 현재 상태가 재생 중이거나 실행 종료 시간이 시작 시간보다 작을 경우 바로 반환 */
    if (this.isPlaying || (toTime && toTime <= currentTime)) return false;

    // 실행 상태 설정
    this._playState = PLAYING;

    // activeIds 실행 시작
    this._startOrStop("start");

    // 이벤트 트리거
    this.trigger("play", { engine: this });

    this._timerId = requestAnimationFrame((time: number) => {
      this._prev = time;
      this._tick({ now: time, autoEnd, to: toTime });
    });
    return true;
  }

  /**
   * 재생 일시 정지
   * @memberof TimelineEngine
   */
  pause() {
    if (this.isPlaying) {
      this._playState = PAUSED;
      // activeIds 실행 정지
      this._startOrStop("stop");

      this.trigger("paused", { engine: this });
    }
    cancelAnimationFrame(this._timerId);
  }

  /**
   * 재생 중단
   * @memberof TimelineEngine
   */
  stop() {
    // 현재 재생 상태를 일시 정지로 설정
    this.pause();
    this._playState = PAUSED;

    // 활성화된 액션들을 모두 중지
    this._startOrStop("stop");

    // 타이머 중지
    cancelAnimationFrame(this._timerId);

    // 이벤트 트리거
    this.trigger("stop", { engine: this });
  }

  /** 재생 완료 */
  private _end() {
    if (this._isLooping) {
      this.setTime(this._loopStart || 0);
      this.play({ toTime: this._loopEnd });
    } else {
      this.stop(); // 재생 종료 시 stop 호출
      this.trigger("ended", { engine: this });
    }
  }

  private _startOrStop(type?: "start" | "stop") {
    for (let i = 0; i < this._activeActionIds.length; i++) {
      const actionId = this._activeActionIds[i];
      const action = this._actionMap[actionId];
      const effect = this._effectMap[action?.effectId];

      if (type === "start") {
        effect?.source?.start &&
          effect.source.start({
            action,
            effect,
            engine: this,
            isPlaying: this.isPlaying,
            time: this.getTime(),
          });
      } else if (type === "stop") {
        effect?.source?.stop &&
          effect.source.stop({
            action,
            effect,
            engine: this,
            isPlaying: this.isPlaying,
            time: this.getTime(),
          });
      }
    }
  }

  /** 매 프레임 실행 */
  private _tick(data: { now: number; autoEnd?: boolean; to?: number }) {
    if (this.isPaused) return;
    const { now, autoEnd, to } = data;

    // 현재 시간 계산
    let currentTime =
      this.getTime() +
      (Math.min(1000, now - this._prev) / 1000) * this._playRate;
    this._prev = now;

    // 루프가 설정되어 있을 때, end 시간을 넘으면 다시 start로 돌아가도록 처리
    if (this._isLooping && this._loopEnd && currentTime >= this._loopEnd) {
      currentTime = this._loopStart || 0;

      this.trigger("playAtLoop", { time: this._loopStart, engine: this });
      this.play({ toTime: currentTime });
    }

    // 현재 시간 설정
    if (to && to <= currentTime) currentTime = to;
    this.setTime(currentTime, true);

    // 액션 실행
    this._tickAction(currentTime);
    // 자동 종료 설정 시, 모든 액션이 완료되었는지 확인
    if (
      !to &&
      autoEnd &&
      this._next >= this._actionSortIds.length &&
      this._activeActionIds.length === 0
    ) {
      this._end();
      return;
    }

    // 종료 여부 확인
    if (to && to <= currentTime) {
      this._end();
    }

    if (this.isPaused) return;
    this._timerId = requestAnimationFrame((time) => {
      this._tick({ now: time, autoEnd, to });
    });
  }

  /** tick 시 액션 실행 */
  private _tickAction(time: number) {
    this._dealEnter(time);
    this._dealLeave(time);

    // 렌더링
    const length = this._activeActionIds.length;
    for (let i = 0; i < length; i++) {
      const actionId = this._activeActionIds[i];
      const action = this._actionMap[actionId];
      const effect = this._effectMap[action.effectId];
      if (effect && effect.source?.update) {
        effect.source.update({
          time,
          action,
          isPlaying: this.isPlaying,
          effect,
          engine: this,
        });
      }
    }
  }

  /** active 데이터 초기화 */
  private _dealClear() {
    while (this._activeActionIds.length) {
      const actionId = this._activeActionIds.shift();
      const action = this._actionMap[actionId];

      const effect = this._effectMap[action?.effectId];
      if (effect?.source?.leave) {
        effect.source.leave({
          action,
          effect,
          engine: this,
          isPlaying: this.isPlaying,
          time: this.getTime(),
        });
      }
    }
    this._next = 0;
  }

  /** 액션 시작 시점 처리 */
  private _dealEnter(time: number) {
    // active 목록에 추가
    while (this._actionSortIds[this._next]) {
      const actionId = this._actionSortIds[this._next];
      const action = this._actionMap[actionId];

      if (!action.disable) {
        // 액션 시작 시간이 도래했는지 확인
        if (action.start > time) break;
        // 액션 실행 가능 여부 확인
        if (action.end > time && !this._activeActionIds.includes(actionId)) {
          const effect = this._effectMap[action.effectId];
          if (effect && effect.source?.enter) {
            effect.source.enter({
              action,
              effect,
              isPlaying: this.isPlaying,
              time,
              engine: this,
            });
          }

          this._activeActionIds.push(actionId);
        }
      }
      this._next++;
    }
  }

  /** 액션 종료 시점 처리 */
  private _dealLeave(time: number) {
    let i = 0;
    while (this._activeActionIds[i]) {
      const actionId = this._activeActionIds[i];
      const action = this._actionMap[actionId];

      // 현재 시간 범위에서 벗어났는지 확인
      if (action.start > time || action.end < time) {
        const effect = this._effectMap[action.effectId];

        if (effect && effect.source?.leave) {
          effect.source.leave({
            action,
            effect,
            isPlaying: this.isPlaying,
            time,
            engine: this,
          });
        }

        this._activeActionIds.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  /** 데이터 처리 */
  private _dealData(data: TimelineRow[]) {
    const actions: TimelineAction[] = [];
    data.map((row) => {
      actions.push(...row.actions);
    });
    const sortActions = actions.sort((a, b) => a.start - b.start);
    const actionMap: Record<string, TimelineAction> = {};
    const actionSortIds: string[] = [];

    sortActions.forEach((action) => {
      actionSortIds.push(action.id);
      actionMap[action.id] = { ...action };
    });
    this._actionMap = actionMap;
    this._actionSortIds = actionSortIds;
  }
}
