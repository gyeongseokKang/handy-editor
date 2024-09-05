"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { cloneDeep } from "lodash";
import { useRef, useState } from "react";
import {
  ScaleState,
  Timeline,
  TimelineState,
} from "./libs/react-timeline-editor";
import { AudioPlayerEffect } from "./libs/react-timeline-editor/components/player/effect/audioPlayerEffect";
import { mockData2 } from "./libs/react-timeline-editor/components/player/mock";
import TimelinePlayer from "./libs/react-timeline-editor/components/player/player";
import Wavesurfer from "./libs/react-timeline-editor/components/wave/Wavesurfer";

// duration 플러그인 사용 설정
dayjs.extend(duration);
const defaultEditorData = cloneDeep(mockData2);

export default function Home() {
  const originalData = cloneDeep(mockData2);
  const [data, setData] = useState(defaultEditorData);
  const [dragLine, setDragLine] = useState(true);
  const [hideCursor, setHideCursor] = useState(false);
  const [dragMode, setDragMode] = useState(true);
  const timelineState = useRef<TimelineState>();
  const autoScrollWhenPlay = useRef<boolean>(true);
  const scaleState = useRef<ScaleState>({
    scale: 5,
    scaleWidth: 300,
    startLeft: 20,
    scaleSplitCount: 10,
  });
  const [waveform, setWaveform] = useState(false);

  const [scale, setScale] = useState(5);
  const [sacleWidth, setScaleWidth] = useState(300);
  const [scaleSplitCount, setScaleSplitCount] = useState(10);
  const handleScaleChange = (value: number) => {
    setScale(value);
    scaleState.current.scale = value;
  };

  const handleScaleWidthChange = (value: number) => {
    setScaleWidth(value);
    scaleState.current.scaleWidth = value;
  };

  const handleScaleSplitCountChange = (value: number) => {
    setScaleSplitCount(value);
    scaleState.current.scaleSplitCount = value;
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      if (e && e.target && e.target.result && files !== null) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const base64Str = Buffer.from(arrayBuffer).toString("base64");
        const contentType = "audio/mp3";

        const audio = new Audio();
        audio.src = URL.createObjectURL(new Blob([arrayBuffer]));
        audio.onloadedmetadata = () => {
          const newData = [...data];
          newData.push({
            id: (newData.length + 1).toString(),
            actions: [
              {
                id: file.name,
                start: 0,
                end: audio.duration,
                effectId: "effect0",
                data: {
                  src: `data:${contentType};base64,${base64Str}`,
                  name: file.name,
                },
                isDragging: false,
              },
            ],
          });
          setData(newData as any);
        };
      }
    });
    const files = event.target.files;
    fileReader.readAsArrayBuffer(files[0]);
  };

  return (
    <div className="p-4">
      <h2>옵션들</h2>
      <div className="py-4 flex gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="dragLine-mode"
            checked={dragLine}
            onCheckedChange={() => {
              setDragLine(!dragLine);
            }}
          />
          <Label htmlFor="dragLine-mode">DragLine</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="autoScroll-mode"
            defaultChecked={autoScrollWhenPlay.current}
            onCheckedChange={(value) => {
              autoScrollWhenPlay.current = value;
            }}
          />
          <Label htmlFor="autoScroll-mode">autoScroll</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="hideCursor-mode"
            checked={hideCursor}
            onCheckedChange={() => {
              setHideCursor(!hideCursor);
            }}
          />
          <Label htmlFor="hideCursor-mode">hideCursor</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="drag-mode"
            checked={dragMode}
            onCheckedChange={() => {
              setDragMode(!dragMode);
            }}
          />
          <Label htmlFor="drag-mode">DragMode</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="drag-mode"
            checked={waveform}
            onCheckedChange={() => {
              setWaveform(!waveform);
            }}
          />
          <Label htmlFor="drag-mode">Waveform</Label>
        </div>
      </div>
      <div>
        <h2>눈금옵션</h2>
        <div className="py-2 flex items-center space-x-2">
          <ScaleSelect scale={scale} setScale={handleScaleChange} />
          <ScaleWidthSelect
            scaleWidth={sacleWidth}
            setScaleWidth={handleScaleWidthChange}
          />
          <ScaleSplitCountSelect
            scaleSplitCount={scaleSplitCount}
            setScaleSplitCount={handleScaleSplitCountChange}
          />
        </div>
      </div>
      <div>
        <h2>파일</h2>
        <div className="py-2 flex items-center space-x-2">
          <FileInput handleAudioUpload={handleAudioUpload} />
        </div>
      </div>

      <TimelinePlayer
        scaleState={scaleState}
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />
      <Timeline
        ref={timelineState}
        onChange={(data) => {
          setData(data as any);
        }}
        scale={scaleState.current.scale}
        scaleWidth={scaleState.current.scaleWidth}
        startLeft={scaleState.current.startLeft}
        scaleSplitCount={scaleState.current.scaleSplitCount}
        editorData={data}
        effects={{
          ...AudioPlayerEffect,
          ...AudioPlayerEffect,
        }}
        hideCursor={hideCursor}
        autoScroll={true}
        dragLine={dragLine}
        disableDrag={!dragMode}
        getScaleRender={(second) => {
          const realSecond = second;
          const timeDuration = dayjs.duration(realSecond, "seconds");
          const hours = timeDuration.hours();

          // 시간에 따라 포맷을 다르게 설정
          if (hours > 0) {
            return (
              <div className="text-xs text-gray-500">
                {timeDuration.format("HH:mm:ss")}
              </div>
            );
          } else {
            return (
              <div className="text-xs text-gray-500">
                {timeDuration.format("mm:ss")}
              </div>
            );
          }
        }}
        getActionRender={(action: any, row, { isDragging }) => {
          const isOriginal = originalData.find(
            (d) => d.actions[0].id === action.id
          );
          return (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className={cn(
                    "relative w-full h-full flex justify-center items-center text-xl text-white",
                    {
                      "cursor-ew-resize": isDragging,
                    }
                  )}
                >
                  <DraggingTimelineTooltip
                    time={action.start}
                    direction="left"
                    isDragging={isDragging}
                  />
                  {waveform ? (
                    <Wavesurfer
                      url={action.data.src}
                      isDragging={isDragging}
                    ></Wavesurfer>
                  ) : (
                    <div className="w-full flex justify-start px-4">
                      {action.data.name}
                    </div>
                  )}
                  <DraggingTimelineTooltip
                    time={action.end}
                    direction="right"
                    isDragging={isDragging}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    const newData = [...data];
                    const target = newData.find((d) =>
                      d.actions.find((a) => a.id === action.id)
                    );
                    const targetAction = target?.actions.find(
                      (a) => a.id === action.id
                    );
                    if (targetAction) {
                      target.actions = target.actions.filter(
                        (a) => a.id !== action.id
                      );
                      setData(newData as any);
                    }
                  }}
                >
                  Delete
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={!isOriginal}
                  onClick={() => {
                    const newData = [...data];
                    const target = newData.find(
                      (d) => d.actions[0].id === action.id
                    );
                    if (target) {
                      const originalTarget = originalData.find(
                        (d) => d.actions[0].id === action.id
                      );
                      if (originalTarget) {
                        target.actions[0].start =
                          originalTarget.actions[0].start;
                        target.actions[0].end = originalTarget.actions[0].end;
                      }
                    }
                    setData(newData as any);
                  }}
                >
                  Reset
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>duplicate</ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48">
                    <ContextMenuItem
                      onClick={() => {
                        const newData = [...data];
                        const target = newData.find((d) =>
                          d.actions.find((a) => a.id === action.id)
                        );
                        const targetAction = target?.actions.find(
                          (a) => a.id === action.id
                        );
                        if (target) {
                          const newAction = cloneDeep(targetAction);
                          newAction.id =
                            `${newAction.id.split("_")[0]}` +
                            "_" +
                            Math.random();
                          newData.push({
                            id: (newData.length + 1).toString(),
                            actions: [newAction],
                          });
                          setData(newData as any);
                        }
                      }}
                    >
                      new line
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        const newData = [...data];
                        const target = newData.find((d) =>
                          d.actions.find((a) => a.id === action.id)
                        );
                        const targetAction = target?.actions.find(
                          (a) => a.id === action.id
                        );
                        if (targetAction) {
                          const duration =
                            targetAction.end - targetAction.start;

                          const newAction = cloneDeep(targetAction);
                          newAction.id =
                            `${newAction.id.split("_")[0]}` +
                            "_" +
                            Math.random();
                          newAction.data.id = newAction.id + "_data";
                          newAction.start = targetAction.start + duration + 5;
                          newAction.end = targetAction.end + duration + 5;
                          target.actions.push(newAction);
                          setData(newData as any);
                        }
                      }}
                    >
                      same line
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuContent>
            </ContextMenu>
          );
        }}
      />
    </div>
  );
}

const FileInput = ({
  handleAudioUpload,
}: {
  handleAudioUpload: (event: any) => void;
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">로컬 파일 업로드(mp3만)</Label>
      <Input
        id="picture"
        type="file"
        onChange={handleAudioUpload}
        accept=".mp3"
      />
    </div>
  );
};

const ScaleSelect = ({ scale, setScale }) => {
  const scaleList = [5, 20, 60, 300, 600];
  return (
    <div className="flex  max-w-sm items-center gap-1.5">
      <Select
        value={scale.toString()}
        onValueChange={(value) => {
          setScale(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Scale" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Scale</SelectLabel>
            {scaleList.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>스케일</Label>
    </div>
  );
};

const ScaleWidthSelect = ({ scaleWidth, setScaleWidth }) => {
  const scaleWidthList = [150, 300, 450, 600];
  return (
    <div className="flex  max-w-sm items-center gap-1.5">
      <Select
        value={scaleWidth.toString()}
        onValueChange={(value) => {
          setScaleWidth(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="ScaleWidth" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>ScaleWidth(px)</SelectLabel>
            {scaleWidthList.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>스케일Width</Label>
    </div>
  );
};
const ScaleSplitCountSelect = ({ scaleSplitCount, setScaleSplitCount }) => {
  const scaleSplitCountList = [5, 10, 20, 60];
  return (
    <div className="flex  max-w-sm items-center gap-1.5">
      <Select
        value={scaleSplitCount.toString()}
        onValueChange={(value) => {
          setScaleSplitCount(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="ScaleSplitCount" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>ScaleSplitCount(px)</SelectLabel>
            {scaleSplitCountList.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label>간격당 눈금개수</Label>
    </div>
  );
};

const DraggingTimelineTooltip = ({
  time,
  direction,
  isDragging,
}: {
  time: number | string;
  direction: "left" | "right";
  isDragging: boolean;
}) => {
  if (!isDragging) {
    return null;
  }

  function isConvertibleToNumber(value) {
    return !isNaN(Number(value));
  }

  const renderTime =
    typeof time === "number"
      ? time.toFixed(2)
      : isConvertibleToNumber(time)
      ? Number(time).toFixed(2)
      : "-";

  return (
    <div
      className={cn(
        `absolute text-sm bg-gray-500 text-white  px-1 rounded`,
        direction === "left" ? "-left-6" : "-right-6"
      )}
    >
      {renderTime}
    </div>
  );
};
