import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import { FiUpload } from "react-icons/fi";

const UploadButton = () => {
  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
          id: crypto.randomUUID(),
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

  return (
    <>
      <Button variant="outline" size="icon">
        <Label htmlFor="audio-upload">
          <FiUpload className="h-[1.2rem] w-[1.2rem]" />
        </Label>
        <Input
          id="audio-upload"
          type="file"
          onChange={handleAudioUpload}
          accept=".mp3, .m4a, .wav"
          className="hidden"
        />
      </Button>
    </>
  );
};

export default UploadButton;
