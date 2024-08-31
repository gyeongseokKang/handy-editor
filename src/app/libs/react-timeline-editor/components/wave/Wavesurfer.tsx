"use client";

import { Button } from "@/components/ui/button";
import WavesurferPlayer from "@wavesurfer/react";
import { memo, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdStop } from "react-icons/md";
const Wavesurfer = ({ url, peak }: { url: string; peak?: string }) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [peakData, setPeakData] = useState([]);

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

  //   useEffect(() => {
  //     if (!peak) return;
  //     const loadPeaks = async () => {
  //       const response = await fetch(peak);
  //       const data = await response.json();
  //       setPeakData(data);
  //     };
  //     // loadPeaks();
  //   }, [peak]);
  //   console.log("peakData", peakData);

  return (
    <div className="w-full relative">
      <WavesurferPlayer
        height={50}
        waveColor="gray"
        normalize={true}
        url={url}
        // {...(peak && { peaks: [[100, 100, 100]] })}
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
