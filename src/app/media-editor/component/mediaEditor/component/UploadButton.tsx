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
      if (file.size > 100 * 1024 * 1024) {
        handleLargeAudioFile(file);
        return;
      } else {
        handleAudio(file);
        return;
      }
    }

    if (file.type.includes("video")) {
      handleVideo(file);
    }
  };

  const handleAudio = (file: File) => {
    const fileReader = new FileReader();

    fileReader.addEventListener("load", (e) => {
      const data = fileReader.result as string;
      // 오디오 객체 생성
      const audio = new Audio();
      audio.src = data; // DataURL을 오디오 소스로 설정

      // 메타데이터가 로드되면 duration을 가져옴
      audio.onloadedmetadata = () => {
        const newTimelineRow = DataStoreUtil.makeTimelineRow();
        newTimelineRow.segments.push({
          id: "audioPlayer" + crypto.randomUUID(),
          start: 0,
          end: audio.duration, // 오디오의 duration 사용
          effectId: "audioPlayer",
          data: {
            src: data, // DataURL 그대로 사용
            name: file.name,
          },
          isDragging: false,
        });

        // 데이터스토어에 추가
        useDataStore.getState().addTimelineRow(newTimelineRow);
      };
    });
    // 파일을 DataURL로 읽음
    fileReader.readAsDataURL(file);
  };

  const handleLargeAudioFile = (file: File) => {
    const chunkSize = 50 * 1024 * 1024; // 50MB 청크 크기
    let offset = 0; // 파일의 읽기 시작 위치
    const chunks: Array<ArrayBuffer> = []; // 청크 데이터를 저장할 배열
    const fileReader = new FileReader();

    const readNextChunk = () => {
      // 파일의 모든 청크를 다 읽었으면 처리 완료
      if (offset >= file.size) {
        // 모든 청크를 Blob으로 결합
        const blob = new Blob(chunks.slice(0, 1), { type: file.type });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.src = audioUrl; // Blob URL을 오디오 소스로 설정

        // 메타데이터가 로드되면 duration을 가져옴
        audio.onloadedmetadata = () => {
          const newTimelineRow = DataStoreUtil.makeTimelineRow();
          newTimelineRow.segments.push({
            id: "audioPlayer" + crypto.randomUUID(),
            start: 0,
            end: audio.duration, // 오디오의 duration 사용
            effectId: "audioPlayer",
            data: {
              src: audioUrl, // Blob URL 사용
              name: file.name,
              isLargefile: true,
            },
            isDragging: false,
          });

          // 데이터스토어에 추가
          useDataStore.getState().addTimelineRow(newTimelineRow);
        };

        return; // 모든 청크를 읽었으므로 함수 종료
      }

      // 청크 읽기 (file.slice로 파일의 일부를 자름)
      const chunk = file.slice(offset, offset + chunkSize);
      fileReader.readAsArrayBuffer(chunk);
    };

    // 각 청크를 성공적으로 읽었을 때 호출되는 이벤트 핸들러
    fileReader.onload = (e) => {
      const arrayBuffer = e.target.result as ArrayBuffer;

      // 청크를 저장
      chunks.push(arrayBuffer);

      // 다음 청크로 이동
      offset += chunkSize;
      readNextChunk();
    };

    // 파일 읽기 오류 처리
    fileReader.onerror = (error) => {
      console.error("파일 읽기 오류:", error);
    };

    // 첫 번째 청크 읽기 시작
    readNextChunk();
  };

  const handleVideo = (file: File) => {
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      const arrayBuffer = e.target.result as ArrayBuffer;

      // 파일의 MIME 타입을 가져와서 사용할 수 있도록 처리
      const contentType = "audio/mp3"; // 기본값으로 mp4 설정

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
