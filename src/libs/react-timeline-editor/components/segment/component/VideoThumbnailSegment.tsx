import { CircularProgressIndicator } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import { VideoPlayerSegment } from "@/libs/react-timeline-editor/interface/segment";
import { DataStoreUtil } from "@/libs/react-timeline-editor/store/DataStore";
import useEngineStore from "@/libs/react-timeline-editor/store/EngineStore";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface VideoThumbnailSegmentProps {
  segment: VideoPlayerSegment;
}

const VideoThumbnailSegment = ({ segment }: VideoThumbnailSegmentProps) => {
  const loadingRef = useRef(true);

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const engine = useEngineStore.getState().engine;
      engine.loadAudioBuffer(segment);
      engine.on("loadEnd", ({ id, audioBuffer }) => {
        if (id === segment.id) {
          loadingRef.current = false;
          DataStoreUtil.fetchAudioBuffer({ segment, audioBuffer });
        }
      });
    }
  }, [inView]);

  return (
    <div className="relative w-full h-full" ref={ref}>
      <div
        id={"ws_" + segment.id}
        className={cn("w-full h-full overflow-hidden")}
      ></div>
      {loadingRef.current && (
        <div className="w-full h-full absolute top-0 bottom-0 flex items-center">
          <CircularProgressIndicator className="size-6 ms-4" />
        </div>
      )}
    </div>
  );
};

export default VideoThumbnailSegment;
