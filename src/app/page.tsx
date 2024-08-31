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
import { cloneDeep } from "lodash";
import { useRef, useState } from "react";
import { Timeline, TimelineState } from "./libs/react-timeline-editor";
import {
  mockData2,
  mockEffect2,
} from "./libs/react-timeline-editor/components/player/mock";
import TimelinePlayer from "./libs/react-timeline-editor/components/player/player";
import Wavesurfer from "./libs/react-timeline-editor/components/wave/Wavesurfer";

const defaultEditorData = cloneDeep(mockData2);

export default function Home() {
  const originalData = cloneDeep(mockData2);
  const [data, setData] = useState(defaultEditorData);
  const [dragLine, setDragLine] = useState(true);
  const [hideCursor, setHideCursor] = useState(false);
  const [dragMode, setDragMode] = useState(true);
  const timelineState = useRef<TimelineState>();
  const autoScrollWhenPlay = useRef<boolean>(true);
  const [waveform, setWaveform] = useState(true);

  const [scale, setScale] = useState(5);
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
        <ScaleSelect scale={scale} setScale={setScale} />
      </div>
      <FileInput handleAudioUpload={handleAudioUpload} />
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />
      <Timeline
        ref={timelineState}
        onChange={(data) => {
          setData(data as any);
        }}
        scale={scale}
        editorData={data}
        effects={mockEffect2}
        hideCursor={hideCursor}
        autoScroll={true}
        dragLine={dragLine}
        disableDrag={!dragMode}
        getActionRender={(action: any) => {
          const isOriginal = originalData.find(
            (d) => d.actions[0].id === action.id
          );
          return (
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-full h-full flex justify-center items-center text-xl text-white">
                  {waveform ? (
                    <Wavesurfer url={action.data.src}></Wavesurfer>
                  ) : (
                    <div>{action.data.name}</div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    setData(
                      data.filter((d) => d.actions[0].id !== action.id) as any
                    );
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
                        if (target) {
                          const duration =
                            targetAction.end - targetAction.start;

                          const newAction = cloneDeep(targetAction);
                          newAction.id =
                            `${newAction.id.split("_")[0]}` +
                            "_" +
                            Math.random();
                          newAction.start = targetAction.start + duration + 5;
                          newAction.end = targetAction.end + duration + 5;
                          console.log(newAction);
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
  const scaleList = [5, 20, 60];
  return (
    <div className="flex w-full max-w-sm items-center gap-1.5">
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
