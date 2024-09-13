import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Online Media Editor",
  description:
    "A browser-based React online media editor, free and open-source. Allows editing of images, videos, and audio, with cross-platform support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TooltipProvider>
        <body>
          <div className="flex flex-col">
            <Topbar />
            <div className="flex w-full">
              <Sidebar />
              <main className="p-2 w-full">{children}</main>
            </div>
          </div>
        </body>
      </TooltipProvider>
    </html>
  );
}
