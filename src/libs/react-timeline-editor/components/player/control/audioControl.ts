import WaveSurfer from "wavesurfer.js";
import { TimelineEngine } from "../../../engine/engine";
import { audioAnalyzer } from "../audioAnalyzer";

class AudioControl {
  cacheMap: Record<string, WaveSurfer> = {};
  listenerMap: Record<
    string,
    {
      time?: (data: { time: number }) => void;
      rate?: (data: { rate: number }) => void;
    }
  > = {};

  start(data: {
    id: string;
    engine: TimelineEngine;
    src: string;
    startTime: number;
    startOffset: number;
    time: number;
    isLargefile?: boolean;
  }) {
    const { id, src, startTime, startOffset, time, engine, isLargefile } = data;
    const seekTime = time - startTime + startOffset;
    let item: WaveSurfer;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.setPlaybackRate(engine.getPlayRate());
      item.setTime(seekTime);
      item.play();
    } else {
      item = WaveSurfer.create({
        url: src,
        container: document.querySelector(`#ws_${id}`) as HTMLElement,
        waveColor: "#9E7FD9",
        progressColor: "#9E7FD9",
        height: 100,
        interact: false,
        autoplay: true,
        hideScrollbar: true,
      });

      this.cacheMap[id] = item;
      item.on("load", (...args) => {
        item.setPlaybackRate(engine.getPlayRate());
        item.setTime(seekTime);
      });
    }

    const timeListener = (data: { time: number }) => {
      const { time } = data;
      const seekTime = time - startTime + startOffset;
      if (seekTime < 0) {
        delete this.listenerMap[id];
      } else {
        item.setTime(seekTime);
      }
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.setPlaybackRate(rate);
    };

    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on("afterSetTime", timeListener);
    engine.on("afterSetPlayRate", rateListener);
    engine.on("stop", () => {
      // FIXME : disconnect 관련 업데이트 필요
      // analyserNode?.connect(Howler.ctx.destination);
    });
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  stop(data: { id: string; engine: TimelineEngine }) {
    const { id, engine } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.stop();
      if (this.listenerMap[id]) {
        this.listenerMap[id].time &&
          engine.off("afterSetTime", this.listenerMap[id].time);
        this.listenerMap[id].rate &&
          engine.off("afterSetPlayRate", this.listenerMap[id].rate);

        delete this.listenerMap[id];
      }
    }
  }

  connectAnalyser(item) {
    const gainNode: GainNode = (item as any)?._sounds[0]?._node;
    const analyserNode = audioAnalyzer.initNode(Howler.ctx.createAnalyser());
    if (gainNode) {
      gainNode.connect(analyserNode);
      analyserNode.connect(Howler.ctx.destination);
    }

    return analyserNode;
  }
}

export default new AudioControl();
