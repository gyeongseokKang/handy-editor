import { forwardRef, useRef } from "react";
import { TimelineRow } from "../../interface/segment";

interface VideoPlayerProps {
  editData: TimelineRow[];
}

const VideoPlayer = ({ editData }: VideoPlayerProps) => {
  // videoRef를 배열로 초기화하여 여러 비디오 엘리먼트를 참조할 수 있게 함
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);

  const videoEditData = editData.filter((item) =>
    item.segments.every((segment) => segment.effectId === "videoPlayer")
  );

  return (
    <div className="flex size-full  rounded-2xl border min-w-[33vw] gap-1">
      {videoEditData.map((video, index) => {
        if (video.segments?.length === 0) return null;
        if ("data" in video.segments[0] === false) return null;
        const { id, data } = video.segments?.[0];
        if ("videoSrc" in data) {
          return (
            <VideoPlayer2
              key={id}
              id={id}
              count={videoEditData.length}
              ref={(el) => (videoRef.current[index] = el)}
              src={data.videoSrc}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default VideoPlayer;

const VideoPlayer2 = forwardRef<
  any,
  { src: string; id: string; count: number }
>(({ src, id, count }, ref) => {
  return (
    <video
      id={id}
      ref={ref}
      style={{
        visibility: "hidden",
        width: `${100 / count}%`,
      }}
      className="z-10 rounded-2xl object-cover  aspect-video flex-1 max-w-[33vw]"
      muted
      src={src}
    />
  );
});
VideoPlayer2.displayName = "VideoPlayer2";
