"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutDashboard, Shuffle } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Handy Editor</h1>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card className="w-full">
          <CardHeader className="flex flex-row gap-4">
            <LayoutDashboard className="w-20 h-20 mb-2 text-primary" />
            <div>
              <CardTitle className="text-3xl">Editor</CardTitle>
              <CardDescription className="text-lg">
                미디어를 쉽게 편집하세요
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              AI를 활용해서 원하는 미디어를 수정하세요. 간단한 조작으로 원하는
              위치에 미디어를 배치할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Link href={"/editor"}>
              <Button>자세히 보기</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row gap-4">
            <Shuffle className="w-20 h-20 mb-2 text-primary" />
            <div>
              <CardTitle className="text-3xl">Placement</CardTitle>
              <CardDescription className="text-lg">
                배경음악을 쉽게 변경하세요
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <p>
              AI를 활용해서 원하는 배경음악을 변경해보세요. 간단한 조작으로
              원하는 위치에 음악을 배치할 수 있습니다.
            </p>
          </CardContent>
          <CardFooter>
            <Link href={"/placement"}>
              <Button>자세히 보기</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
