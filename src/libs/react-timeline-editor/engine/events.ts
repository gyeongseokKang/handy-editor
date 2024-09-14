import { TimelineEngine } from "./engine";

export class Events {
  handlers = {};

  constructor(handlers = {}) {
    this.handlers = {
      beforeSetTime: [],
      afterSetTime: [],
      setTimeByTick: [],
      beforeSetPlayRate: [],
      afterSetPlayRate: [],
      setActiveSegmentIds: [],
      timeUpdate: [],
      play: [],
      stop: [],
      playAtLoop: [],
      paused: [],
      ended: [],
      loadStart: [],
      loadProgress: [],
      loadEnd: [],
      ...handlers,
    };
  }
}

export interface EventTypes {
  /**
   * 시간 설정 전(수동)
   * @type {{ time: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  beforeSetTime: { time: number; engine: TimelineEngine };
  /**
   * 시간 설정 후(수동)
   * @type {{ time: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  afterSetTime: { time: number; engine: TimelineEngine };
  /**
   * tick으로 시간 설정 후
   * @type {{ time: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  setTimeByTick: { time: number; engine: TimelineEngine };
  /**
   * 실행 속도 설정 전
   * false를 반환하면 속도 설정을 막음
   * @type {{ speed: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  beforeSetPlayRate: { rate: number; engine: TimelineEngine };
  /**
   * 실행 속도 설정 후
   * @type {{ speed: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  afterSetPlayRate: { rate: number; engine: TimelineEngine };
  /**
   * 재생
   * @type {{engine: TimelineEngine}}
   * @memberof EventTypes
   */
  play: { engine: TimelineEngine };
  /**
   * 일시 정지
   * @type {{ engine: TimelineEngine }}
   * @memberof EventTypes
   */
  playAtLoop: { time: number; engine: TimelineEngine };
  /**
   * 일시 정지
   * @type {{ engine: TimelineEngine }}
   * @memberof EventTypes
   */
  paused: { engine: TimelineEngine };
  /**
   * 실행 종료
   * @type {{ engine: TimelineEngine }}
   * @memberof EventTypes
   */
  stop: { engine: TimelineEngine };
  /**
   * 실행 종료
   * @type {{ engine: TimelineEngine }}
   * @memberof EventTypes
   */
  ended: { engine: TimelineEngine };
  /**
   * 시간 업데이트
   * @type {{ time: number, engine: TimelineEngine }}
   * @memberof EventTypes
   */
  timeUpdate: { currentTime: number };
  /**
   * 데이터 로딩 관련 리스너
   */
  loadStart: { id: string };
  loadProgress: { id: string; progress: number };
  loadEnd: { id: string };
}
