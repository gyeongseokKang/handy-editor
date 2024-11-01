"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import Sparkles from "react-sparkle";
import usePlayerStore, { Segment } from "../stores/PlayerStore";
import { getAudio } from "../utils/getAudio";
const SegmentPlayer = () => {
  const segmentList = usePlayerStore((state) => state.segmentList);
  return (
    <div className="w-5/12 flex flex-col gap-2  max-w-[600px]">
      {segmentList.map((segment) => {
        return <SegmentCard key={segment.id} segment={segment} />;
      })}
    </div>
  );
};

export default SegmentPlayer;

const SegmentCard = ({ segment }: { segment: Segment }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const segmentData = getAudio(segment.id);
  const currentSegment = usePlayerStore((state) => state.segment);
  const handleSelect = () => {
    usePlayerStore.setState({
      segment: segment,
    });
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }} // 아래쪽에서 시작 위치와 투명도 설정
      animate={{ y: 0, opacity: 1 }} // 애니메이션 동안의 위치와 투명도
      exit={{ y: 50, opacity: 0 }} // 컴포넌트가 제거될 때 아래로 슬라이드 아웃
      transition={{ type: "spring", stiffness: 50 }} // 애니메이션 전환 설정
    >
      <Card
        className={cn("w-full py-2 bg-[#1F232D]", {
          "bg-gradient opacity-80": currentSegment?.id === segment.id,
        })}
      >
        <CardContent className="w-full flex items-center h-full px-4 py-2 gap-2">
          <p className="text-xl mx-4">{segment.id}</p>
          <Image
            className={cn("rounded-full", {
              "animate-spin": isPlaying,
            })}
            src={`https://picsum.photos/seed/${segment.id}/40/40`}
            width={40}
            height={40}
            alt="segment"
          />
          <div className="flex flex-col">
            <p>
              {segmentData.title} - {segmentData.artist}
            </p>
            <p className="text-sm">
              {segmentData.duration} | {segmentData.bpm} | {segmentData.moods}
            </p>
          </div>

          <div className="ml-auto inline-flex items-center justify-center">
            {isPlaying ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setIsPlaying(false);
                }}
              >
                <MdPause size={30} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setIsPlaying(true);
                }}
              >
                <MdPlayArrow size={30} />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              onClick={handleSelect}
            >
              {currentSegment?.id === segment.id && (
                <Sparkles flicker={false} count={5} overflowPx={2} />
              )}
              <Sparkle size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
