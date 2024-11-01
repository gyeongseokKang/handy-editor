"use client";

import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useMemo, useRef } from "react";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import usePlayerStore from "../stores/PlayerStore";
import { MediaPlayer } from "../utils/MediaPlayer";
import { generateRandomSegment } from "../utils/generateRandomSegment";
const VideoWithWaveform = () => {
  return (
    <div className="w-full min-h-[30vh] flex flex-col justify-evenly ">
      <video
        id="currentVideo"
        src="/video/아이들_클락션_240p.mp4"
        className="w-full max-w-lg"
      />
      <Wavesurfer url="/video/아이들_클락션_240p.mp4" />
    </div>
  );
};

export default VideoWithWaveform;

const Wavesurfer = ({ url }: { url: string }) => {
  const containerRef = useRef(null);
  const reginsRef = useRef(RegionsPlugin.create());
  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 50,
    waveColor: "#bbbbbb",
    barGap: 3,
    barRadius: 4,
    barWidth: 2,
    barHeight: 0.75,
    progressColor: "#eeeeee",
    url: url,

    plugins: useMemo(() => [reginsRef.current], []),
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("ready", () => {
        const segments = generateRandomSegment(wavesurfer.getDuration());
        loadRegions(reginsRef.current, segments);

        const mediaPlayer = new MediaPlayer({
          waveSurfer: wavesurfer,
          video: document.getElementById("currentVideo") as HTMLVideoElement,
        });

        usePlayerStore.getState().setMediaPlayer(mediaPlayer);
      });

      reginsRef.current.on("region-clicked", (region) => {
        usePlayerStore.getState().setSegment({
          start: region.start,
          end: region.end,
          id: region.id,
        });

        setTimeout(() => {
          wavesurfer.setTime(region.start);
        }, 0);
      });
    }
  }, [wavesurfer]);

  return (
    <div className={"w-full"}>
      <div className="p-2 ">
        <div ref={containerRef} />
      </div>
    </div>
  );
};

const loadRegions = async (
  regions: RegionsPlugin,
  segments: {
    start: number;
    end: number;
    id: string;
  }[]
) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < 5; i++) {
    regions.addRegion({
      id: segments[i].id,
      start: segments[i].start,
      end: segments[i].end,
      color: "rgba(255, 255, 255, 0.3)",
      drag: false,
      resize: false,
    });
    usePlayerStore.getState().addSegmentList(segments[i]);

    await delay(1000); // 1초 지연
  }

  regions.getRegions().forEach((region, index) => {
    const loader = createMarker(index + 1);
    region.element.style.borderRadius = "10px";
    region.element.appendChild(loader);
  });
};
function createMarker(index) {
  const contentDiv = document.createElement("div");
  contentDiv.style.position = "relative"; // marker 위치 조정에 필요한 설정
  contentDiv.style.width = "100%";
  contentDiv.style.height = "100%";
  contentDiv.style.display = "flex";
  contentDiv.style.alignItems = "center";
  contentDiv.style.justifyContent = "center";
  contentDiv.style.borderRadius = "10px";

  // Marker 추가 (index 값 표시)
  const marker = document.createElement("div");
  marker.innerText = index;
  marker.style.position = "absolute";
  marker.style.top = "5px";
  marker.style.left = "5px";
  marker.style.backgroundColor = "#6D28D9"; // 사용자 프로젝트 메인 컬러 사용
  marker.style.color = "white";
  marker.style.padding = "2px 6px";
  marker.style.borderRadius = "4px";
  marker.style.fontSize = "12px";
  contentDiv.appendChild(marker);

  return contentDiv;
}
