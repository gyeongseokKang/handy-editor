"use client";

import PathBreadcrumb from "@/components/common/PathBreadcrumb";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRef, useState } from "react";
import { GoSidebarExpand } from "react-icons/go";
import MediaEditor from "./component/mediaEditor/MediaEditor";
import OptionSideBar from "./component/optionSideBar/OptionSideBar";
export default function MediaEditorPage() {
  const refs = useRef();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <ResizablePanelGroup direction="horizontal" ref={refs} className="relative">
      <ResizablePanel defaultSize={80} order={1}>
        <div>
          <PathBreadcrumb />
          <MediaEditor />
        </div>
      </ResizablePanel>
      {!isCollapsed ? (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            order={2}
            defaultValue={20}
            collapsedSize={0}
            minSize={20}
            collapsible
            onCollapse={() => {
              setIsCollapsed(true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
            }}
          >
            <OptionSideBar />
          </ResizablePanel>
        </>
      ) : (
        <Button
          className="absolute top-0 right-0"
          onClick={() => {
            setIsCollapsed(false);
          }}
        >
          <GoSidebarExpand />
        </Button>
      )}
    </ResizablePanelGroup>
  );
}
