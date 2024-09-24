import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useDataStore from "@/libs/react-timeline-editor/store/DataStore";
import { useState } from "react";

const exportFormatList = ["mp3", "mov", "wav", "mp4"] as const;
const exportResolutionList = ["360p", "480p", "720p", "1080p"] as const;

const ExportPanel = () => {
  const [exportFormat, setExportFormat] =
    useState<(typeof exportFormatList)[number]>("mp4");
  const [exportResolution, setExportResolution] =
    useState<(typeof exportResolutionList)[number]>("1080p");

  const timelineRowList = useDataStore((state) => state.timelineRowList);

  const handleExport = () => {
    console.log(timelineRowList);
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
          >
            {resolution}
          </Button>
        ))}
      </div>
      <Button onClick={handleExport} disabled>
        Export Project(TBD)
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
