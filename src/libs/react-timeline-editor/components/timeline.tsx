/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import useOptionStore from "@/app/store/OptionStore";
import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { OnScrollParams, ScrollSync } from "react-virtualized";
import { ITimelineEngine } from "../engine/engine";
import {
  MIN_SCALE_COUNT,
  ROW_HEADER_DEFAULT_WIDTH,
  START_CURSOR_TIME,
} from "../interface/const";
import { TimelineRow } from "../interface/segment";
import { TimelineEditor, TimelineState } from "../interface/timeline";
import useEngineStore from "../store/EngineStore";
import useScrollStore from "../store/ScrollStore";
import { checkProps } from "../utils/check_props";
import {
  getScaleCountByRows,
  parserPixelToTime,
  parserTimeToPixel,
} from "../utils/deal_data";
import { Cursor } from "./cursor/cursor";
import { DragAreaCursor } from "./cursor/dragAreaCursor";
import { EditArea } from "./edit_area/edit_area";
import RowHeaderArea from "./header_area/RowHeaderArea";
import { TimeArea } from "./time_area/time_area";

export const Timeline = React.forwardRef<TimelineState, TimelineEditor>(
  (props, ref) => {
    const checkedProps = checkProps(props);
    let {
      effects,
      editorData: data,
      autoScroll,
      hideCursor,
      disableDrag,
      minScaleCount,
      maxScaleCount,
      onChange,
      autoReRender = true,
      onScroll: onScrollVertical,
    } = checkedProps;

    const { scale, scaleWidth, startLeft } = useOptionStore(
      (state) => state.editorOption.scaleState
    );

    const engineRef = useRef<ITimelineEngine>(useEngineStore.getState().engine);
    const domRef = useRef<HTMLDivElement>();
    const areaRef = useRef<HTMLDivElement>();
    const scrollSync = useRef<ScrollSync>();

    // 편집기 데이터
    const [editorData, setEditorData] = useState(data);
    // 스케일 개수
    const [scaleCount, setScaleCount] = useState(MIN_SCALE_COUNT);
    // 커서 위치 시간
    const [cursorTime, setCursorTime] = useState(START_CURSOR_TIME);
    // 재생 중인지 여부
    const [isPlaying, setIsPlaying] = useState(false);
    // 현재 타임라인 너비
    const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

    const [drag, setDrag] = useState({
      start: undefined,
      end: undefined,
    });

    /** 데이터 변경 감지 */
    useLayoutEffect(() => {
      handleSetScaleCount(getScaleCountByRows(data, { scale }));
      setEditorData(data);
    }, [data, minScaleCount, maxScaleCount, scale]);

    useEffect(() => {
      engineRef.current.effects = effects;
    }, [effects]);

    useEffect(() => {
      engineRef.current.data = editorData;
    }, [editorData]);

    useEffect(() => {
      autoReRender && engineRef.current.reRender();
    }, [editorData]);

    /** 동적으로 스케일 개수 설정 */
    const handleSetScaleCount = (value: number) => {
      const data = Math.min(maxScaleCount, Math.max(minScaleCount, value));
      setScaleCount(data);
    };

    /** 사용자 데이터 변경 처리 */
    const handleEditorDataChange = (editorData: TimelineRow[]) => {
      const result = onChange(editorData);
      if (result !== false) {
        engineRef.current.data = editorData;
        autoReRender && engineRef.current.reRender();
      }
    };

    /** 커서 처리 */
    const handleSetCursor = (param: {
      left?: number;
      time?: number;
      updateTime?: boolean;
    }) => {
      let { left, time, updateTime = true } = param;
      if (typeof left === "undefined" && typeof time === "undefined") return;

      if (typeof time === "undefined") {
        if (typeof left === "undefined")
          left = parserTimeToPixel(time, { startLeft, scale, scaleWidth });
        time = parserPixelToTime(left, { startLeft, scale, scaleWidth });
      }

      let result = true;
      if (updateTime) {
        result = engineRef.current.setTime(time);
        autoReRender && engineRef.current.reRender();
      }
      result && setCursorTime(time);
      return result;
    };

    const handleLoop = (start: number, end: number) => {
      engineRef.current.setLoop(start, end);
      engineRef.current.reRender();
    };

    /** 스크롤 좌측 설정 */
    const handleDeltaScrollLeft = (delta: number) => {
      // 최대 거리를 초과할 경우 자동 스크롤 금지
      const scrollLeft = useScrollStore.getState().scrollLeft;

      const data = scrollLeft + delta;
      if (data > scaleCount * (scaleWidth - 1) + startLeft - width) return;
      const newScrollLeft = Math.max(scrollLeft + delta, 0);
      useScrollStore.getState().setScrollState({
        scrollLeft: newScrollLeft,
      });
      scrollSync.current &&
        scrollSync.current.setState({
          scrollLeft: newScrollLeft,
        });
    };

    // 엔진 관련 데이터 처리
    useEffect(() => {
      const handleTime = ({ time }) => {
        handleSetCursor({ time, updateTime: false });
      };
      const handleLoop = ({ time }) => {
        handleSetCursor({ time, updateTime: true });
      };

      const handleStop = () => {
        handleSetCursor({ time: 0, updateTime: true });
      };
      const handlePlay = () => setIsPlaying(true);
      const handlePaused = () => setIsPlaying(false);
      engineRef.current.on("setTimeByTick", handleTime);
      engineRef.current.on("playAtLoop", handleLoop);
      engineRef.current.on("play", handlePlay);
      engineRef.current.on("stop", handleStop);
      engineRef.current.on("paused", handlePaused);
    }, [scale, scaleWidth, startLeft]);

    // ref 데이터
    useImperativeHandle(ref, () => ({
      get target() {
        return domRef.current;
      },
      get listener() {
        return engineRef.current;
      },
      get isPlaying() {
        return engineRef.current.isPlaying;
      },
      get isPaused() {
        return engineRef.current.isPaused;
      },
      setPlayRate: engineRef.current.setPlayRate.bind(engineRef.current),
      getPlayRate: engineRef.current.getPlayRate.bind(engineRef.current),
      setTime: (time: number) => {
        handleSetCursor({ time });
      },
      setLoop(start, end) {
        engineRef.current.setLoop(start, end);
      },
      getTime: engineRef.current.getTime.bind(engineRef.current),
      reRender: engineRef.current.reRender.bind(engineRef.current),
      play: (param: Parameters<TimelineState["play"]>[0]) =>
        engineRef.current.play({ ...param }),
      pause: engineRef.current.pause.bind(engineRef.current),
      stop: engineRef.current.stop.bind(engineRef.current),
      setScrollLeft: (val) => {
        const scrollLeft = Math.max(val, 0);
        useScrollStore.getState().setScrollState({
          scrollLeft: scrollLeft,
        });
        scrollSync.current &&
          scrollSync.current.setState({ scrollLeft: scrollLeft });
      },
      setScrollTop: (val) => {
        const scrollTop = Math.max(val, 0);
        useScrollStore.getState().setScrollState({
          scrollTop: scrollTop,
        });

        scrollSync.current &&
          scrollSync.current.setState({ scrollTop: scrollTop });
      },
    }));

    // 타임라인 영역의 너비 변화 감지
    useEffect(() => {
      if (areaRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          if (!areaRef.current) return;
          setWidth(areaRef.current.getBoundingClientRect().width);
        });
        resizeObserver.observe(areaRef.current!);
        return () => {
          resizeObserver && resizeObserver.disconnect();
        };
      }
    }, []);

    return (
      <div ref={domRef} className={`relative flex size-full bg-[#191b1d] `}>
        <ScrollSync ref={scrollSync}>
          {({ onScroll, scrollLeft, scrollTop }) => {
            const handleOnScroll = (params: OnScrollParams) => {
              onScroll(params);
              useScrollStore.getState().setScrollState(params);
            };

            const cursorScrollLeft = scrollLeft - ROW_HEADER_DEFAULT_WIDTH;

            return (
              <div className="relative size-full">
                <div className="absolute top-[0px] left-0 h-full z-30">
                  <RowHeaderArea data={data} scrollTop={scrollTop} />
                </div>
                <div>
                  <TimeArea
                    {...checkedProps}
                    timelineWidth={width}
                    setCursor={handleSetCursor}
                    cursorTime={cursorTime}
                    editorData={editorData}
                    scaleCount={scaleCount}
                    setScaleCount={handleSetScaleCount}
                    onScroll={handleOnScroll}
                    scrollLeft={scrollLeft}
                    onDragTimeArea={(start, end) => {
                      setDrag({
                        start,
                        end,
                      });
                      handleLoop(start, end);
                    }}
                  />
                  <EditArea
                    {...checkedProps}
                    timelineWidth={width}
                    ref={(ref) =>
                      ((areaRef.current as any) = ref?.domRef.current) as any
                    }
                    disableDrag={disableDrag || isPlaying}
                    editorData={editorData}
                    cursorTime={cursorTime}
                    scaleCount={scaleCount}
                    setScaleCount={handleSetScaleCount}
                    scrollTop={scrollTop}
                    scrollLeft={scrollLeft}
                    setEditorData={handleEditorDataChange}
                    deltaScrollLeft={autoScroll && handleDeltaScrollLeft}
                    onScroll={(params) => {
                      handleOnScroll(params);
                      onScrollVertical && onScrollVertical(params);
                    }}
                  />
                  {!hideCursor && (
                    <Cursor
                      {...checkedProps}
                      timelineWidth={width}
                      disableDrag={isPlaying}
                      scrollLeft={cursorScrollLeft}
                      scaleCount={scaleCount}
                      setScaleCount={handleSetScaleCount}
                      setCursor={handleSetCursor}
                      cursorTime={cursorTime}
                      editorData={editorData}
                      areaRef={areaRef}
                      deltaScrollLeft={autoScroll && handleDeltaScrollLeft}
                    />
                  )}
                  {drag.start && drag.end && (
                    <DragAreaCursor
                      {...checkedProps}
                      drag={drag}
                      timelineWidth={width}
                      disableDrag={isPlaying}
                      scrollLeft={cursorScrollLeft}
                      scaleCount={scaleCount}
                      setScaleCount={handleSetScaleCount}
                      setCursor={handleSetCursor}
                      cursorTime={drag.start}
                      editorData={editorData}
                      areaRef={areaRef}
                      deltaScrollLeft={autoScroll && handleDeltaScrollLeft}
                    />
                  )}
                </div>
              </div>
            );
          }}
        </ScrollSync>
      </div>
    );
  }
);
