import { Badge } from "@/components/ui/badge";
import { forwardRef, useRef } from "react";
import { TimelineRow } from "../../interface/segment";

interface VideoPlayerProps {
  editData: TimelineRow[];
}

const VideoPlayer = ({ editData }: VideoPlayerProps) => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);

  const videoEditData = editData.filter((item) =>
    item.segments.every((segment) => segment.effectId === "videoPlayer")
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "10px",
      }}
      className="w-full"
    >
      {videoEditData.length === 0 && (
        <div className="min-h-48 flex items-center justify-center w-full">
          No video data
        </div>
      )}
      {videoEditData.map((video, index) => {
        if (video.segments?.length === 0) return null;
        if ("data" in video.segments[0] === false) return null;
        const { id, data } = video.segments?.[0];
        if ("videoSrc" in data) {
          return (
            <SegmentVideoPlayer
              key={id}
              id={id}
              count={videoEditData.length}
              ref={(el) => (videoRef.current[index] = el)}
              src={data.videoSrc}
              label={data.name}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default VideoPlayer;

const SegmentVideoPlayer = forwardRef<
  any,
  { src: string; id: string; count: number; label: string }
>(({ src, id, label }, ref) => {
  return (
    <div
      className="relative w-full aspect-video"
      style={{
        maxWidth: "500px",
        minWidth: "300px",
      }}
    >
      <div className="absolute  aspect-video top-0 left-0 right-0 bottom-0 bg-red-500/20 z-0  flex justify-center items-center">
        <span className="text-xl">Out of Time</span>
      </div>
      <video
        id={id}
        ref={ref}
        style={{
          visibility: "hidden",
        }}
        preload="metadata"
        className="z-10 object-cover aspect-video absolute w-full"
        muted
        src={src}
      />
      <div className="absolute top-0 left-1 z-20 ">
        <Badge className="text-xxxs" variant="secondary">
          {label}
        </Badge>
      </div>
    </div>
  );
});
SegmentVideoPlayer.displayName = "SegmentVideoPlayer";
