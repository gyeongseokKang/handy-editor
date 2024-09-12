import React, { useEffect, useRef, useState } from "react";
import { audioAnalyzer } from "./audioAnalyzer";

const AudioVisualizer: React.FC = () => {
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const decibelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [decibel, setDecibel] = useState<number>(0);

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
    canvasCtx.fillStyle = "rgba(0, 0, 0, 1)"; // 배경색
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // 데시벨 막대 그래프를 그리는 함수
  const drawDecibel = (
    decibelCanvasCtx: CanvasRenderingContext2D,
    decibelCanvas: HTMLCanvasElement
  ) => {
    if (!analyserNode) return;

    // getDecibelData로 정확한 데시벨 데이터를 가져옴
    const frequencyData = audioAnalyzer.getDecibelData();
    if (frequencyData) {
      let avg =
        frequencyData.reduce((acc, cur) => acc + cur, 0) / frequencyData.length; // 평균 데시벨 계산

      // 데시벨 값이 너무 작을 경우 -100 dB로 제한
      avg = Math.max(avg, -100); // 최소값 -100 dB로 제한

      setDecibel(avg); // 데시벨 수치 업데이트

      // 캔버스 지우기
      decibelCanvasCtx.clearRect(
        0,
        0,
        decibelCanvas.width,
        decibelCanvas.height
      );

      // 데시벨 막대 그리기 (데시벨 범위는 -100dB에서 0dB)
      const decibelHeight = ((avg + 100) / 100) * decibelCanvas.height; // -100dB에서 0dB로 스케일링
      decibelCanvasCtx.fillStyle = "rgba(255, 0, 0, 1)";
      decibelCanvasCtx.fillRect(
        0,
        decibelCanvas.height - decibelHeight,
        decibelCanvas.width,
        decibelHeight
      ); // 막대 그리기
    }
  };

  // 막대 그래프로 오디오 시각화 그리기
  const drawBars = (
    canvasCtx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (!analyserNode) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteFrequencyData(dataArray); // 주파수 데이터를 가져옴

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
    canvasCtx.fillStyle = "rgba(0, 0, 0, 1)"; // 배경색
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 20;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // 막대 높이를 원하는 비율로 조정 (여기서 0.5는 조정 비율입니다)
      barHeight = dataArray[i] * 0.5; // 막대 높이 조절

      // 막대 색상
      const r = barHeight + 25 * (i / bufferLength);
      const g = 250 * (i / bufferLength);
      const b = 50;

      canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
      canvasCtx.fillRect(
        x,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2
      ); // 막대 그리기

      x += barWidth + 1;
    }
  };

  // 오디오 시각화 및 기본 캔버스 그리기
  useEffect(() => {
    if (!waveCanvasRef.current || !decibelCanvasRef.current) return;

    const waveCanvas = waveCanvasRef.current;
    const waveCanvasCtx = waveCanvas.getContext("2d");

    const decibelCanvas = decibelCanvasRef.current;
    const decibelCanvasCtx = decibelCanvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);

      // analyserNode가 없으면 기본 스타일을 그립니다.
      if (!analyserNode && waveCanvasCtx) {
        drawDefaultCanvas(waveCanvasCtx, waveCanvas);
        return;
      }

      // 막대(bar) 그래프로 오디오 시각화 그리기
      if (analyserNode && waveCanvasCtx) {
        drawBars(waveCanvasCtx, waveCanvas); // 막대 그래프 그리기
      }

      // 데시벨 막대 그래프 그리기 (분리된 함수 사용)
      if (decibelCanvasCtx && decibelCanvas) {
        drawDecibel(decibelCanvasCtx, decibelCanvas);
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
      <h2>Audio Visualizer {decibel.toFixed(1)}㏈</h2>
      <div className="flex gap-1">
        <canvas ref={waveCanvasRef} width={400} height={100} />
        <canvas ref={decibelCanvasRef} width={10} height={100} />
      </div>
    </>
  );
};

export default AudioVisualizer;
