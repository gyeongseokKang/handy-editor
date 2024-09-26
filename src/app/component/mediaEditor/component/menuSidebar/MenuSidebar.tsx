import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { FaFileExport } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { ImperativePanelHandle } from "react-resizable-panels";
import ExportPanel from "./component/ExportPanel";
import UploadPanel from "./component/UploadPanel";

const menuList = [
  {
    icon: <MdOutlineFileUpload size={20} />,
    label: "Upload",
    panel: <UploadPanel />,
  },
  {
    icon: <FaFileExport size={16} />,
    label: "Export",
    panel: <ExportPanel />,
  },
] as const;

type MenuLabel = (typeof menuList)[number]["label"];

const MenuSidebar = () => {
  const ref = useRef<ImperativePanelHandle>();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentMenu, setCurrentMenu] = useState<MenuLabel | "">();

  const toggleMenu = (menu: MenuLabel) => {
    if (currentMenu === menu) {
      setCurrentMenu("");
      ref.current?.collapse();
      return;
    }
    setCurrentMenu(menu);
    setTimeout(() => {
      ref.current?.expand();
    }, 100);
  };

  const currentPanel = menuList.find(
    (menu) => menu.label === currentMenu
  )?.panel;

  return (
    <>
      <div className="flex flex-col gap-2 py-2">
        {menuList.map((menu) => (
          <div key={menu.label}>
            <Button
              className="size-12"
              variant={menu.label === currentMenu ? "default" : "outline"}
              onClick={() => toggleMenu(menu.label)}
            >
              <div className="flex flex-col items-center justify-center">
                {menu.icon}
                <p className="text-xxs">{menu.label}</p>
              </div>
            </Button>
          </div>
        ))}
      </div>

      <ResizablePanel
        ref={ref}
        defaultValue={0}
        collapsedSize={0}
        minSize={15}
        maxSize={40}
        collapsible
        onCollapse={() => {
          setIsCollapsed(true);
          setCurrentMenu("");
        }}
        onExpand={() => {
          setIsCollapsed(false);
          if (!currentMenu) {
            setCurrentMenu("Upload");
          }
        }}
      >
        <ScrollArea className="h-full p-2">
          <div className="flex gap-1">
            {currentPanel && (
              <div className="flex p-2 w-full">{currentPanel}</div>
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle={!isCollapsed} />
    </>
  );
};

export default MenuSidebar;
