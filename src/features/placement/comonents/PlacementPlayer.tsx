"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import usePlayerStore from "../stores/PlayerStore";
import { getSample } from "../utils/getAudio";
interface Track {
  moods: string;
  bpm: string;
  artist: string;
  title: string;
  duration: number;
  url: string;
}

const PlacementPlayer = () => {
  const tracks = getSample(5);
  const segment = usePlayerStore((state) => state.segment);
  return (
    <div className="w-7/12 p-2 flex flex-col gap-4">
      <div className="inline-flex items-center gap-2">
        <p className="text-xl">Music Library</p>{" "}
        <MdAddCircleOutline size={20} />
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        {segment && (
          <div className="flex w-max space-x-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.title + index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.2, // 각 TrackCard가 순차적으로 나타나도록 지연 설정
                  duration: 0.5,
                }}
              >
                <TrackCard track={track} />
              </motion.div>
            ))}
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default PlacementPlayer;

const TrackCard = ({ track }: { track: Track }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card
      key={track.title}
      className="w-[200px] rounded-lg bg-neutral-900 border-neutral-800 group relative"
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={`https://picsum.photos/seed/${track.title}/200/300`}
            alt={track.title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div
            className={cn(
              "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
              {
                "opacity-100": isPlaying,
              }
            )}
          >
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 rounded-full"
              onClick={toggleAudio}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-white truncate">
            {track.title}
          </h3>
        </div>
        <audio ref={audioRef} src={track.url} />
      </CardContent>
    </Card>
  );
};
