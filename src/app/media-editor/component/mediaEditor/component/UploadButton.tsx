import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import { FiUpload } from "react-icons/fi";

const UploadButton = () => {
  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.includes("audio")) {
      handleAudio(file);
    }

    if (file.type.includes("video")) {
      handleVideo(file);
    }
  };

  const handleAudio = (file: File) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      const arrayBuffer = e.target.result as ArrayBuffer;

      // 파일의 MIME 타입을 가져와서 사용할 수 있도록 처리
      const contentType = file.type || "audio/mp3"; // 기본값으로 mp3 설정

      const base64Str = Buffer.from(arrayBuffer).toString("base64");

      const audio = new Audio();
      audio.src = URL.createObjectURL(
        new Blob([arrayBuffer], { type: contentType })
      );
      audio.onloadedmetadata = () => {
        const newTimelineRow = DataStoreUtil.makeTimelineRow();
        newTimelineRow.segments.push({
          id: "audioPlayer" + crypto.randomUUID(),
          start: 0,
          end: audio.duration,
          effectId: "audioPlayer",
          data: {
            src: `data:${contentType};base64,${base64Str}`,
            name: file.name,
          },
          isDragging: false,
        });
        useDataStore.getState().addTimelineRow(newTimelineRow);
      };
    });

    fileReader.readAsArrayBuffer(file);
  };

  const handleVideo = (file: File) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      const arrayBuffer = e.target.result as ArrayBuffer;

      // 파일의 MIME 타입을 가져와서 사용할 수 있도록 처리
      const contentType = file.type || "video/mp4"; // 기본값으로 mp4 설정

      const base64Str = Buffer.from(arrayBuffer).toString("base64");

      const videoSrc = URL.createObjectURL(
        new Blob([arrayBuffer], { type: contentType })
      );

      const audio = new Audio();
      audio.src = URL.createObjectURL(
        new Blob([arrayBuffer], { type: contentType })
      );
      audio.onloadedmetadata = () => {
        const newTimelineRow = DataStoreUtil.makeTimelineRow();
        newTimelineRow.segments.push({
          id: "videoPlayer" + crypto.randomUUID(),
          start: 0,
          end: audio.duration,
          effectId: "videoPlayer",
          data: {
            src: `data:${contentType};base64,${base64Str}`,
            videoSrc: videoSrc,
            name: file.name,
          },
          isDragging: false,
        });
        useDataStore.getState().addTimelineRow(newTimelineRow);
      };
    });

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Button variant="outline" size="icon">
        <Label htmlFor="audio-upload">
          <FiUpload className="h-[1.2rem] w-[1.2rem]" />
        </Label>
        <Input
          id="audio-upload"
          type="file"
          onChange={handleMediaUpload}
          accept=".mp3, .m4a, .wav, .mp4"
          className="hidden"
        />
      </Button>
    </>
  );
};

export default UploadButton;
