import PlacementPlayer from "@/features/placement/comonents/PlacementPlayer";
import PlalyerController from "@/features/placement/comonents/PlalyerController";
import SegmentPlayer from "@/features/placement/comonents/SegmentPlayer";
import VideoWithWaveform from "@/features/placement/comonents/VideoWithWaveform";

const EditorPage = () => {
  return (
    <div className="size-full p-6">
      <VideoWithWaveform />
      <PlalyerController />
      <div className="w-full gap-2 flex justify-between">
        <SegmentPlayer />
        <PlacementPlayer />
      </div>
    </div>
  );
};

export default EditorPage;
