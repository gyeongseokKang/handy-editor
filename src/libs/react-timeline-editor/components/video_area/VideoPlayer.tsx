import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forwardRef, useRef } from "react";
import { TimelineRow } from "../../interface/segment";
import useDataStore from "../../store/DataStore";

interface VideoPlayerProps {
  editData: TimelineRow[];
}

const VideoPlayer = ({ editData }: VideoPlayerProps) => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);

  const videoEditData = editData.filter((item) =>
    item.segments.some((segment) => segment.effectId === "videoPlayer")
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
        return video.segments.map((segment) => {
          if (!("data" in segment)) return null;

          const { id, data } = segment;
          if (!("videoSrc" in data)) return null;

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
        });
      })}
    </div>
  );
};

export default VideoPlayer;

const SegmentVideoPlayer = forwardRef<
  any,
  { src: string; id: string; count: number; label: string }
>(({ src, id, label }, ref) => {
  const isSelected = useDataStore((state) => state.selectedSegmentList).find(
    (seg) => seg.id === id
  );
  return (
    <div
      className={cn("relative w-full aspect-video", {
        "ring-2 ring-blue-500": isSelected,
      })}
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
        controls
        preload="metadata"
        className={cn("z-10 object-cover aspect-video absolute w-full")}
        muted
        src={src}
      />
      <div className="absolute top-0 left-1 z-20 ">
        <div className="flex gap-1">
          <Badge className="text-xxs" variant="secondary">
            {label}
          </Badge>
        </div>
      </div>
    </div>
  );
});
SegmentVideoPlayer.displayName = "SegmentVideoPlayer";
