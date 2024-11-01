import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AudioPlayerSegment } from "@/libs/react-timeline-editor/interface/segment";
import useDataStore from "@/libs/react-timeline-editor/store/DataStore";
import { useState } from "react";
import { toast } from "sonner";

const exportFormatList = ["mp3", "mov", "wav", "mp4"] as const;
const exportResolutionList = ["360p", "480p", "720p", "1080p"] as const;

const ExportPanel = () => {
  const [exportFormat, setExportFormat] =
    useState<(typeof exportFormatList)[number]>("wav");
  const [exportResolution, setExportResolution] =
    useState<(typeof exportResolutionList)[number]>("1080p");

  const timelineRowList = useDataStore((state) => state.timelineRowList);

  const audioPlayerSegments = timelineRowList
    .flatMap((row) => row.segments)
    .filter((segment) => segment.data.audioBuffer) as AudioPlayerSegment[];

  const handleExport = async () => {
    if (audioPlayerSegments.length === 0) {
      toast("There is no audio segment to export.");
      return;
    }
    // Timeline의 모든 row에서 가장 긴 duration을 계산
    const duration = timelineRowList
      .flatMap((row) => row.segments)
      .reduce((acc, segment) => {
        return Math.max(acc, segment.end);
      }, 0);
    // OfflineAudioContext 생성 (2채널, 샘플레이트 48000, 총 길이 duration에 맞게 설정)
    const offlineAudioContext = new OfflineAudioContext(
      2,
      48000 * duration,
      48000
    );

    for (let i = 0; i < audioPlayerSegments.length; i++) {
      const segment = audioPlayerSegments[i];
      const bufferSource = offlineAudioContext.createBufferSource();
      bufferSource.buffer = segment.data.audioBuffer;
      const { start, end, data } = segment;
      const { startOffset } = data; // 세그먼트의 시작 시간 오프셋
      const offset = start; // 타임라인 상에서 오디오가 언제 시작되는지 정의
      const segmentDuration = end - start; // 타임라인 상에서 세그먼트의 길이

      // audioBuffer 내에서 어느 부분부터 재생할지 계산 (startTimeOffset 사용)
      const startTimeOffsetInBuffer = startOffset || 0; // 기본값은 0초

      // buffer에서 시작하는 위치부터 남은 길이를 계산
      const availableDurationInBuffer =
        bufferSource.buffer.duration - startTimeOffsetInBuffer;

      // 세그먼트에서 재생 가능한 실제 길이 계산
      const actualDuration = Math.min(
        segmentDuration,
        availableDurationInBuffer
      );

      const gainNode = offlineAudioContext.createGain();
      gainNode.gain.value = 1;

      // Connect the bufferSource to the gainNode, and then to the destination
      bufferSource.connect(gainNode);
      gainNode.connect(offlineAudioContext.destination);

      // AudioBuffer 내의 startTimeOffset에서 시작하여 실제 재생 가능한 duration만큼 재생
      bufferSource.start(offset, startTimeOffsetInBuffer, actualDuration);
    }

    // OfflineAudioContext에서 렌더링 수행
    const renderedBuffer = await offlineAudioContext.startRendering();

    // 내보내기 위한 WAV 포맷 등으로 변환 (이 부분은 WAV 변환 라이브러리를 활용 가능)
    exportToWAV(renderedBuffer);
  };

  // WAV 변환 함수 (간단한 예시)
  const exportToWAV = (audioBuffer) => {
    const wavBlob = audioBufferToWAVBlob(audioBuffer); // AudioBuffer -> WAV 변환
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "exported-audio.wav";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col size-full gap-2">
      <Label>Format</Label>
      <div className="w-full gap-1 flex flex-wrap">
        {exportFormatList.map((format) => (
          <Button
            key={format}
            variant={exportFormat === format ? "default" : "outline"}
            onClick={() => setExportFormat(format)}
            className="flex-1 mb-2"
            disabled={format !== "wav"}
          >
            {format}
          </Button>
        ))}
      </div>
      <Separator />
      <Label>Resolution</Label>
      <div className="w-full gap-1 flex flex-wrap">
        {exportResolutionList.map((resolution) => (
          <Button
            key={resolution}
            variant={exportResolution === resolution ? "default" : "outline"}
            onClick={() => setExportResolution(resolution)}
            className="flex-1 mb-2"
            disabled
          >
            {resolution}
          </Button>
        ))}
      </div>
      <Button
        onClick={() => {
          handleExport();
        }}
      >
        Export Segment({audioPlayerSegments.length}) to WAV File
      </Button>
    </div>
  );
};

export default ExportPanel;

//  const convertWavToMp3ByFFmpeg = async (
//   wavFile: string,
//   onProgress?: (ratio: number | undefined) => void
// ) => {
//   onProgress?.(Math.floor(0));
//   const { createFFmpeg, fetchFile } = (await import("@ffmpeg/ffmpeg")).default;

//   const ffmpeg = createFFmpeg({
//     mainName: "main",
//     log: false,
//     corePath: "https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js",
//   });
//   await ffmpeg.load();

//   ffmpeg.setProgress(({ ratio }) => {
//     if (ratio * 100 > 99) {
//       onProgress?.(100);
//       return;
//     }
//     onProgress?.(Math.floor(ratio * 100));
//   });

//   ffmpeg.FS("writeFile", "test.wav", await fetchFile(wavFile));
//   const args = "-i test.wav result.mp3".split(" ");
//   ffmpeg.run(...args);

//   const mp3Data = ffmpeg.FS("readFile", "result.mp3");

//   return new Blob([mp3Data.buffer], { type: "audio/mp3" });
// };

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
