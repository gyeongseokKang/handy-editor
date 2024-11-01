"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { ToggleThemeButton } from "./ToggleThemeButton";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AudioLines, LayoutDashboard, Shuffle } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Editor",
    url: "/editor",
    icon: AudioLines,
  },
  {
    title: "Placement",
    url: "/placement",
    icon: Shuffle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <>
      <Sidebar collapsible="icon" className="bg-card">
        <SidebarHeader>
          <SidebarContent className="p-2">
            {open ? <h1 className="text-xl font-bold">Handy Editor</h1> : null}
          </SidebarContent>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      tooltip={item.title}
                      className={cn(
                        "hover:bg-primary/50 group-data-[collapsible=icon]:!p-2",
                        {
                          "bg-primary/20": pathname === item.url,
                        }
                      )}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden ">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="ml-auto flex gap-4 items-center flex-wrap justify-center">
            <ToggleThemeButton />
            <Link
              href="https://github.com/gyeongseokKang/online-media-editor"
              target="_blank"
            >
              <FaGithub size={30} />
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
