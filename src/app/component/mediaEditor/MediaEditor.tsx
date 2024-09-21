"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Timeline, TimelineState } from "@/libs/react-timeline-editor";
import RowHeaderArea from "@/libs/react-timeline-editor/components/header_area/RowHeaderArea";
import AudioVisualizer from "@/libs/react-timeline-editor/components/player/AudioVisualizer";
import { AudioPlayerEffect } from "@/libs/react-timeline-editor/components/player/effect/audioPlayerEffect";
import { VideoPlayerEffect } from "@/libs/react-timeline-editor/components/player/effect/videoPlayerEffect";

import useOptionStore from "@/app/store/OptionStore";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimelinePlayer from "@/libs/react-timeline-editor/components/player/player";
import Segment from "@/libs/react-timeline-editor/components/segment/Segment";
import ScaleRender from "@/libs/react-timeline-editor/components/time_area/ScaleRender";
import VideoPlayer from "@/libs/react-timeline-editor/components/video_area/VideoPlayer";
import EventSubscriptor from "@/libs/react-timeline-editor/engine/EventSubscriptor";
import useDataStore from "@/libs/react-timeline-editor/store/DataStore";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { useRef, useState } from "react";
import { GoSidebarExpand } from "react-icons/go";
import { ImperativePanelHandle } from "react-resizable-panels";
import MenuSidebar from "./component/menuSidebar/MenuSidebar";
import OptionSideBar from "./component/optionSideBar/OptionSideBar";

export default function MediaEditor() {
  const data = useDataStore((state) => state.timelineRowList);
  const setData = useDataStore((state) => state.setTimelineRowList);
  const timelineState = useRef<TimelineState>();
  const ref = useRef<ImperativePanelHandle>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleExpand = () => {
    ref.current.expand();
  };

  const [visualizer, setVisualizer] = useState(false);
  const isWaveformVisible = useEngineStore((state) => state.isWaveformVisible);

  const scaleState = useOptionStore((state) => state.editorOption.scaleState);

  return (
    <>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={30}>
          <ResizablePanelGroup direction="horizontal" className="relative">
            <MenuSidebar />
            <ResizablePanel defaultSize={60}>
              <ScrollArea className="size-full rounded-md ">
                <div className="py-1 flex gap-2">
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

                <div className="px-2 w-full h-full ">
                  <VideoPlayer editData={data} />
                </div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              ref={ref}
              defaultValue={0}
              collapsedSize={0}
              minSize={15}
              collapsible
              onCollapse={() => {
                setIsCollapsed(true);
              }}
              onExpand={() => {
                setIsCollapsed(false);
              }}
            >
              <ScrollArea className="size-full rounded-md ">
                <OptionSideBar />
              </ScrollArea>
            </ResizablePanel>
            {isCollapsed && (
              <Button className="absolute top-2 right-2" onClick={handleExpand}>
                <GoSidebarExpand />
              </Button>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={10}>
          <TimelinePlayer />
          <ScrollArea className="size-full">
            <div className="size-full flex mb-[100px]">
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
                disableDrag={false}
                getScaleRender={(second) => <ScaleRender second={second} />}
                getSegmentRender={(
                  segment,
                  row,
                  { isDragging, isResizing }
                ) => {
                  return (
                    <Segment
                      segment={segment}
                      row={row}
                      isDragging={isDragging}
                      isResizing={isResizing}
                    />
                  );
                }}
              />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      <EventSubscriptor timelineState={timelineState} />
    </>
  );
}
