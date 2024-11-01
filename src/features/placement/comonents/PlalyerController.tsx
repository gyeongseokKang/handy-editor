"use client";

import { Button } from "@/components/ui/button";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { MdPause, MdPlayArrow } from "react-icons/md";
import usePlayerStore from "../stores/PlayerStore";
const PlalyerController = () => {
  const mediaPlayer = usePlayerStore((state) => state.mediaPlayer);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  return (
    <div className="flex w-full p-2 justify-center gap-4">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          mediaPlayer.prev();
        }}
      >
        <BsFillSkipStartFill size={30} />
      </Button>
      {isPlaying ? (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            mediaPlayer.pause();
          }}
        >
          <MdPause size={30} />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            mediaPlayer.play();
          }}
        >
          <MdPlayArrow size={30} />
        </Button>
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          mediaPlayer.next();
        }}
      >
        <BsFillSkipEndFill size={30} />
      </Button>
    </div>
  );
};

export default PlalyerController;
