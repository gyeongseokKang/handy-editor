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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Timeline, TimelineState } from "@/libs/react-timeline-editor";
import RowHeaderArea from "@/libs/react-timeline-editor/components/header_area/RowHeaderArea";
import AudioVisualizer from "@/libs/react-timeline-editor/components/player/AudioVisualizer";
import { AudioPlayerEffect } from "@/libs/react-timeline-editor/components/player/effect/audioPlayerEffect";
import { VideoPlayerEffect } from "@/libs/react-timeline-editor/components/player/effect/videoPlayerEffect";

import TimelinePlayer from "@/libs/react-timeline-editor/components/player/player";
import ScaleRender from "@/libs/react-timeline-editor/components/time_area/ScaleRender";
import VideoPlayer from "@/libs/react-timeline-editor/components/video_area/VideoPlayer";
import Wavesurfer from "@/libs/react-timeline-editor/components/wave/Wavesurfer";
import { TimelineRow } from "@/libs/react-timeline-editor/interface/segment";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import { useRef, useState } from "react";
import useOptionStore from "../../store/OptionStore";
import UploadButton from "./component/UploadButton";

export default function MediaEditor() {
  const data = useDataStore((state) => state.timelineRowList);
  const setData = useDataStore((state) => state.setTimelineRowList);
  const [dragMode, setDragMode] = useState(true);
  const timelineState = useRef<TimelineState>();
  const autoScrollWhenPlay = useRef<boolean>(true);

  const [waveform, setWaveform] = useState(false);
  const [visualizer, setVisualizer] = useState(false);

  const scaleState = useOptionStore((state) => state.editorOption.scaleState);

  return (
    <div className="px-2">
      <div className="py-4 flex gap-2">
        <div className="flex items-center space-x-2">
          <UploadButton />
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
        <div className="flex items-center space-x-2">
          <Switch
            id="analyzer-mode"
            checked={visualizer}
            onCheckedChange={() => {
              setVisualizer(!visualizer);
            }}
          />
          <Label htmlFor="analyzer-mode">Audio Visualizer</Label>
        </div>
      </div>
      {visualizer && <AudioVisualizer />}
      <VideoPlayer editData={data} />

      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />
      <div className="flex gap-1 w-full">
        <RowHeaderArea
          data={data}
          getRowHeader={({ id }, rowIndex) => {
            return <div className="text">{`Row_#${rowIndex + 1}`}</div>;
          }}
        />
        <Timeline
          ref={timelineState}
          scale={scaleState.scale}
          scaleWidth={scaleState.scaleWidth}
          startLeft={scaleState.startLeft}
          scaleSplitCount={scaleState.scaleSplitCount}
          onChange={(data) => {
            setData(data as any);
          }}
          editorData={data}
          effects={{
            ...AudioPlayerEffect,
            ...VideoPlayerEffect,
          }}
          autoScroll={true}
          dragLine={true}
          disableDrag={!dragMode}
          getScaleRender={(second) => <ScaleRender second={second} />}
          getSegmentRender={(segment: any, row, { isDragging }) => {
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
                      time={segment.start}
                      direction="left"
                      isDragging={isDragging}
                    />
                    {waveform ? (
                      <Wavesurfer
                        url={segment.data.src}
                        isDragging={isDragging}
                      ></Wavesurfer>
                    ) : (
                      <div className="w-full flex justify-start px-4">
                        {segment.id?.split("-")[0]}
                      </div>
                    )}
                    <DraggingTimelineTooltip
                      time={segment.end}
                      direction="right"
                      isDragging={isDragging}
                    />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => {
                      DataStoreUtil.deleteAndUpdateSegment({
                        segment,
                      });
                    }}
                  >
                    Delete
                  </ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>Copy</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      <ContextMenuItem
                        onClick={() => {
                          DataStoreUtil.copyAndUpdateSegment({
                            segment,
                            type: "newLine",
                          });
                        }}
                      >
                        Copy to new row
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          DataStoreUtil.copyAndUpdateSegment({
                            segment,
                            type: "sameLine",
                          });
                        }}
                      >
                        Copy to same row
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
              </ContextMenu>
            );
          }}
        />
      </div>
    </div>
  );
}

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

export const sample: TimelineRow[] = [
  // {
  //   id: "row1",
  //   segments: [
  //     {
  //       id: "최애의아이",
  //       start: 0,
  //       end: 226,
  //       effectId: "audioPlayer",
  //       data: {
  //         id: "최애의아이",
  //         src: "/audio/최애의아이.mp3",
  //         name: "최애의아이",
  //       },
  //     },
  //     // ...Array.from({ length: 20 }).map((_, i) => ({
  //     //   id: `내손을잡아${i}`,
  //     //   start: i * 5,
  //     //   end: i * 5 + 5,
  //     //   effectId: "audioPlayer",
  //     //   data: {
  //     //     id: `내손을잡아${i}`,
  //     //     src: "/audio/내손을잡아.mp3",
  //     //     name: `내손을잡아${i}`,
  //     //   },
  //     // })),
  //   ],
  // },
  {
    id: "row2",
    segments: [
      {
        id: "video_18분짜리",
        start: 10,
        end: 1167,
        effectId: "videoPlayer",
        data: {
          id: "video_18분짜리",
          src: "/video/18분짜리 인터뷰.mp4",
          name: "18분짜리 인터뷰",
        },
      },
    ],
  },

  // ...Array.from({ length: 20 }).map((_, i) => ({
  //   id: `${i + 2}`,
  //   segments: [
  //     {
  //       id: `최애의아이${i}`,
  //       start: i * 5,
  //       end: i * 5 + 5,
  //       effectId: "audioPlayer",
  //       data: {
  //         id: `최애의아이${i}`,
  //         src: "/audio/최애의아이.mp3",
  //         name: `최애의아이${i}`,
  //       },
  //     },
  //   ],
  // })),

  // {
  //   id: "3",
  //   segments: [
  //     {
  //       id: "스트리밍",
  //       start: 0,
  //       end: 4008,
  //       effectId: "audioStreammingPlayer",
  //       data: {
  //         src: "https://d2u3ecdp9u36hp.cloudfront.net/music_replacement/2/20240829/dQNsCjxEoE0EJ8w=/web_convert%2FStreetFoodFighterEp01_SOV.mp3",
  //         peak: "https://d2u3ecdp9u36hp.cloudfront.net/music_replacement/2/20240829/dQNsCjxEoE0EJ8w=/web_convert%2FStreetFoodFighterEp01_SOV_48.json",
  //         name: "스트리밍(1시간 6분 48초)",
  //       },
  //     },
  //   ],
  // },
];
