import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { MdOutlineAudiotrack, MdOutlineFileUpload } from "react-icons/md";
import { ImperativePanelHandle } from "react-resizable-panels";
import { match } from "ts-pattern";
import UploadPanel from "./component/UploadPanel";

const MenuSidebar = () => {
  const ref = useRef<ImperativePanelHandle>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [currentMenu, setCurrentMenu] = useState("");

  const menuList = [
    {
      icon: <MdOutlineFileUpload size={20} />,
      label: "Upload",
    },
    {
      icon: <MdOutlineAudiotrack size={20} />,
      label: "Audio",
    },
  ];

  const Panel = match(currentMenu)
    .with("upload", () => <UploadPanel />)
    .otherwise(() => null);

  const toggleMenu = (menu: string) => {
    if (currentMenu === menu) {
      setCurrentMenu("");
      ref.current?.collapse();
      return;
    }
    setCurrentMenu(menu);
    ref.current?.expand();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {menuList.map((menu) => {
          return (
            <div key={menu.label}>
              <Button
                className="size-12"
                variant={
                  menu.label.toLocaleLowerCase() === currentMenu
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  toggleMenu(menu.label.toLocaleLowerCase());
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  {menu.icon}
                  <p className="text-xxs">{menu.label}</p>
                </div>
              </Button>
            </div>
          );
        })}
      </div>
      <ResizablePanel
        ref={ref}
        defaultValue={0}
        collapsedSize={0}
        minSize={15}
        collapsible
        onCollapse={() => {
          setIsCollapsed(true);
          setCurrentMenu("");
        }}
        onExpand={() => {
          setIsCollapsed(false);
        }}
      >
        <ScrollArea className="h-full px-1">
          <div className="flex gap-1">
            {currentMenu && <div className="flex p-2 w-full">{Panel}</div>}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle={!isCollapsed} />
    </>
  );
};

export default MenuSidebar;
