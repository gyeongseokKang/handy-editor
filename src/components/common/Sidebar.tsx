"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GrMultimedia } from "react-icons/gr";
import { SiAudiomack } from "react-icons/si";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <aside className="w-16 bg-gray-900 flex flex-col items-center py-4 space-y-4 min-h-[calc(100vh-4rem)]">
        <Link href="/media-editor">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("text-white size-10 p-0", {
                  "bg-gray-500": pathname.startsWith("/media-editor"),
                })}
              >
                <SiAudiomack className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Media Editor</p>
            </TooltipContent>
          </Tooltip>
        </Link>
        <Link href="/music-placement">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("text-white size-10 p-0", {
                  "bg-gray-500": pathname.startsWith("/music-placement"),
                })}
              >
                <GrMultimedia className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Music Placement</p>
            </TooltipContent>
          </Tooltip>
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;
