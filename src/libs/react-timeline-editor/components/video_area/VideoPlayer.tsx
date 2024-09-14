import { forwardRef, useRef } from "react";
import { TimelineState } from "../../interface/timeline";
import { CusTomTimelineRow } from "../player/type";

interface VideoPlayerProps {
  editData: CusTomTimelineRow[];
  timelineState: React.MutableRefObject<TimelineState>;
}

const VideoPlayer = ({ editData, timelineState }: VideoPlayerProps) => {
  // videoRef를 배열로 초기화하여 여러 비디오 엘리먼트를 참조할 수 있게 함
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);

  const videoEditData = editData.filter((item) =>
    item.segments.every((segment) => segment.effectId === "videoPlayer")
  );

  console.log(videoEditData);
  return (
    <>
      {videoEditData.map((video, index) => {
        if (video.segments?.length === 0) return null;
        const { id, src } = video.segments?.[0]?.data;
        if (!src) return null;
        return (
          <VideoPlayer2
            key={id}
            id={id}
            ref={(el) => (videoRef.current[index] = el)}
            src={src}
          />
        );
      })}
    </>
  );
};

export default VideoPlayer;

const VideoPlayer2 = forwardRef<any, { src: string; id: string }>(
  ({ src, id }, ref) => {
    return (
      <video
        id={id}
        ref={ref}
        style={{
          visibility: "hidden",
        }}
        className="size-full max-w-screen-sm rounded-2xl object-cover"
        muted
        controls
        src={src}
      />
    );
  }
);
VideoPlayer2.displayName = "VideoPlayer2";
