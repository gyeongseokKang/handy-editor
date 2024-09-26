import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AudioPlayerSegment,
  VideoPlayerSegment,
} from "@/libs/react-timeline-editor/interface/segment";
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
    audio.onloadedmetadata = async () => {
      // get audiobuffer form audio
      // Decode the audio data into an AudioBuffer
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const arrayBuffer = await fetch(data).then((res) => res.arrayBuffer());
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const newTimelineRow = DataStoreUtil.makeTimelineRow();
      const newSegment: AudioPlayerSegment = {
        id: "audioPlayer_" + crypto.randomUUID(),
        start: 0,
        end: audio.duration, // 오디오의 duration 사용
        effectId: "audioPlayer",
        data: {
          startOffset: 0,
          src: data, // DataURL 그대로 사용
          name: file.name,
          audioBuffer: audioBuffer, // AudioBuffer 추가
          volume: 100,
        },
        isDragging: false,
      };
      newTimelineRow.segments.push(newSegment);
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
      audio.onloadedmetadata = async () => {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        const arrayBuffer = await fetch(audioUrl).then((res) =>
          res.arrayBuffer()
        );
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const newTimelineRow = DataStoreUtil.makeTimelineRow();
        const newSegment: AudioPlayerSegment = {
          id: "audioPlayer_" + crypto.randomUUID(),
          start: 0,
          end: audio.duration, // 오디오의 duration 사용
          effectId: "audioPlayer",
          data: {
            startOffset: 0,
            src: audioUrl, // DataURL 그대로 사용
            name: file.name,
            audioBuffer: audioBuffer, // AudioBuffer 추가
            volume: 100,
          },
          isDragging: false,
        };
        newTimelineRow.segments.push(newSegment);
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
    const data = fileReader.result as string;
    // 오디오 객체 생성
    const audio = new Audio();
    audio.src = data; // DataURL을 오디오 소스로 설정

    // 메타데이터가 로드되면 duration을 가져옴
    audio.onloadedmetadata = async () => {
      // get audiobuffer form audio
      // Decode the audio data into an AudioBuffer
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      const arrayBuffer = await fetch(data).then((res) => res.arrayBuffer());
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const videoSrc = URL.createObjectURL(file);

      const newTimelineRow = DataStoreUtil.makeTimelineRow();
      const newSegment: VideoPlayerSegment = {
        id: "videoPlayer_" + crypto.randomUUID(),
        start: 0,
        end: audio.duration, // 오디오의 duration 사용
        effectId: "videoPlayer",
        data: {
          startOffset: 0,
          src: data, // DataURL 그대로 사용
          name: file.name,
          videoSrc: videoSrc,
          audioBuffer: audioBuffer, // AudioBuffer 추가
          volume: 100,
        },
        isDragging: false,
      };
      newTimelineRow.segments.push(newSegment);
      // 데이터스토어에 추가
      useDataStore.getState().addTimelineRow(newTimelineRow);
    };
  });
  fileReader.readAsDataURL(file);
};

// AudioBuffer를 WAV 파일로 변환하는 함수 (간단한 변환기)
const audioBufferToWAVBlob = (audioBuffer) => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numberOfChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // WAV 헤더 작성
  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true);

  // PCM 데이터 작성
  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([view], { type: "audio/wav" });
};
