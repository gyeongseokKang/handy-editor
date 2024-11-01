import { AppSidebar } from "@/components/common/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./Provider";
export const metadata: Metadata = {
  title: "Handy Editor",
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
      <body>
        <Provider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <div className="flex flex-col h-dvh w-full">
              <div className="flex size-full">
                <main className="size-full">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
