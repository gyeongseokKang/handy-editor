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
    <>
      {videoEditData.map((video, index) => {
        if (video.segments?.length === 0) return null;
        if ("data" in video.segments[0] === false) return null;
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
