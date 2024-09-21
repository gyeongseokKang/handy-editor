import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useDataStore, {
  DataStoreUtil,
} from "@/libs/react-timeline-editor/store/DataStore";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";

const UploadPanel = () => {
  const { toast } = useToast();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const acceptedFileTypes = {
    "audio/mpeg": [".mp3"],
    "video/mp4": [".mp4"],
    "video/quicktime": [".mov"],
    "audio/wav": [".wav"],
  };

  const supportType = Object.values(acceptedFileTypes)
    .map((item) => item.join(",").replaceAll(".", ""))
    .join(", ");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop(acceptedFiles, fileRejections, event) {
      acceptedFiles.forEach((file) => {
        handleMediaUpload(file);
      });
      if (fileRejections.length > 0) {
        toastUnsupportFormat();
      }
    },
    accept: acceptedFileTypes,
  });

  const handleMediaUpload = (file) => {
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

  const handleFileUrlUpload = async (url: string) => {
    setIsLoading(true);
    try {
      // url이 적절한 형식인지 체크
      const isValidUrl = url.match(/^(http|https):\/\/[^ "]+$/gm);
      if (!isValidUrl) {
        throw new Error("파일 형식을 확인할 수 없습니다.");
      }

      const response = await fetch(url);
      const contentType = response.headers.get("content-type");

      if (!contentType) {
        throw new Error("파일 형식을 확인할 수 없습니다.");
      }

      const fileBlob = await response.blob();
      const fileName = url.split("/").pop() || "file";

      const file = new File([fileBlob], fileName, { type: contentType });

      handleMediaUpload(file);
      setFileUrl("");
    } catch (error) {
      console.error("파일을 가져오는 데 실패했습니다.", error);
      toast({
        variant: "destructive",
        title: "Failed to load file.",
        description: "Please check if the URL is valid.",
      });
    }
    setIsLoading(false);
  };

  const toastUnsupportFormat = () => {
    toast({
      variant: "destructive",
      title: "Only support format : " + supportType,
    });
  };

  return (
    <div className="flex flex-col size-full">
      <div
        {...getRootProps()}
        className="border rounded border-dashed border-card-foreground p-2 w-full aspect-video flex flex-col items-center justify-center cursor-grab"
      >
        <input {...getInputProps()} />
        <MdOutlineFileUpload size={40} />
        <p>Drag and Drop</p>
        <p className="text-xxs">{supportType}</p>
      </div>
      <Separator />
      <div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="url"
            value={fileUrl}
            placeholder="Enter file URL"
            onChange={(e) => {
              e.currentTarget.value && setFileUrl(e.currentTarget.value);
            }}
          />
          <Button
            disabled={isLoading}
            type="submit"
            onClick={() => {
              handleFileUrlUpload(fileUrl);
            }}
          >
            Load
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPanel;

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
        id: "audioPlayer_" + crypto.randomUUID(),
        start: 0,
        end: audio.duration, // 오디오의 duration 사용
        effectId: "audioPlayer",
        data: {
          startOffset: 0,
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
      const blob = new Blob(chunks, { type: file.type });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio();
      audio.src = audioUrl; // Blob URL을 오디오 소스로 설정

      // 메타데이터가 로드되면 duration을 가져옴
      audio.onloadedmetadata = () => {
        const newTimelineRow = DataStoreUtil.makeTimelineRow();
        newTimelineRow.segments.push({
          id: "audioPlayer_" + crypto.randomUUID(),
          start: 0,
          end: audio.duration, // 오디오의 duration 사용
          effectId: "audioPlayer",
          data: {
            src: audioUrl, // Blob URL 사용
            name: file.name,
            startOffset: 0,
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
        id: "videoPlayer_" + crypto.randomUUID(),
        start: 0,
        end: audio.duration,
        effectId: "videoPlayer",
        data: {
          src: `data:${contentType};base64,${base64Str}`,
          videoSrc: videoSrc,
          startOffset: 0,
          name: file.name,
        },
        isDragging: false,
      });
      useDataStore.getState().addTimelineRow(newTimelineRow);
    };
  });
  fileReader.readAsArrayBuffer(file);
};
