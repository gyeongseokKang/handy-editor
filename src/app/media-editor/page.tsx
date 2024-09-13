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
import { ImperativePanelHandle } from "react-resizable-panels";
import MediaEditor from "./component/mediaEditor/MediaEditor";
import OptionSideBar from "./component/optionSideBar/OptionSideBar";

export default function MediaEditorPage() {
  const ref = useRef<ImperativePanelHandle>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleExpand = () => {
    ref.current.expand();
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="relative">
        <ResizablePanel defaultSize={80}>
          <div>
            <PathBreadcrumb />
            <MediaEditor />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          ref={ref}
          defaultValue={20}
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
          <OptionSideBar />
        </ResizablePanel>
        {isCollapsed && (
          <Button className="absolute top-2 right-2" onClick={handleExpand}>
            <GoSidebarExpand />
          </Button>
        )}
      </ResizablePanelGroup>
    </>
  );
}
