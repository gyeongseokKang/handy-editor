import React, { useEffect, useRef, useState } from "react";
import { audioAnalyzer } from "./audioAnalyzer";

const AudioVisualizer: React.FC = () => {
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // analyserNode가 연결될 때 호출되는 이벤트 처리
  useEffect(() => {
    if (!audioAnalyzer) return;

    audioAnalyzer.onConnect = () => {
      setAnalyserNode(audioAnalyzer.getNode());
      console.log("New connection detected!");
    };
  }, []);

  // 캔버스에 기본 스타일 그리기 (analyserNode가 없을 때)
  const drawDefaultCanvas = (
    canvasCtx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    canvasCtx.fillStyle = "rgba(50, 50, 50, 1)"; // 기본 배경 색
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.font = "24px Arial";
    canvasCtx.fillStyle = "white";
    canvasCtx.textAlign = "center";
    canvasCtx.fillText(
      "Waiting for audio input...",
      canvas.width / 2,
      canvas.height / 2
    );
  };

  // 오디오 시각화 및 기본 캔버스 그리기
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);

      // analyserNode가 없으면 기본 스타일을 그립니다.
      if (!analyserNode && canvasCtx) {
        drawDefaultCanvas(canvasCtx, canvas);
        return;
      }

      if (analyserNode && canvasCtx) {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgba(0, 0, 0, 1)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgba(0, 255, 0, 1)";
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    };

    draw();
  }, [analyserNode]);

  useEffect(() => {
    // 컴포넌트가 랜더링되며 초기화를 진행함
    setAnalyserNode(audioAnalyzer.getNode());
  }, []);

  return (
    <>
      <h2>Audio Visualizer</h2>
      <canvas ref={canvasRef} width={200} height={50} />
    </>
  );
};

export default AudioVisualizer;
