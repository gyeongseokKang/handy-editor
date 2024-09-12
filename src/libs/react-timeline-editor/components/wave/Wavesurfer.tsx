"use client";

import { Button } from "@/components/ui/button";
import WavesurferPlayer from "@wavesurfer/react";
import { memo, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdStop } from "react-icons/md";

interface WavesurferProps {
  url: string;
  isDragging: boolean;
}
const Wavesurfer = ({ url, isDragging }: WavesurferProps) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onStop = () => {
    wavesurfer && wavesurfer.stop();
  };

  return (
    <div className={"w-full relative "}>
      <WavesurferPlayer
        height={50}
        waveColor="gray"
        normalize={true}
        url={url}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="top-2 absolute -right-20">
        <Button size="icon" onClick={onPlayPause}>
          {isPlaying ? <IoMdPause size={30} /> : <IoMdPlay size={30} />}
        </Button>
        <Button size="icon" onClick={onStop}>
          <MdStop size={30} />
        </Button>
      </div>
    </div>
  );
};

export default memo(Wavesurfer);
