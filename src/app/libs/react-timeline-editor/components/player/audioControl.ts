import { Howl } from "howler";
import { TimelineEngine } from "../../engine/engine";
import { audioAnalyzer } from "./audioAnalyzer";

class AudioControl {
  cacheMap: Record<string, Howl> = {};
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
    time: number;
    isStreamming?: boolean;
  }) {
    const { id, src, startTime, time, engine } = data;
    let item: Howl;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.rate(engine.getPlayRate());
      item.seek(time - startTime);
      item.play();
    } else {
      item = new Howl({
        src,
        loop: true,
        autoplay: true,
        ...(data.isStreamming && { html5: true }),
      });

      const gainNode: GainNode = (item as any)?._sounds[0]?._node;
      if (gainNode) {
        const analyserNode = audioAnalyzer.initNode(
          Howler.ctx.createAnalyser()
        );
        console.log("connect~");

        gainNode.connect(analyserNode);
        analyserNode.connect(Howler.ctx.destination);
      }

      this.cacheMap[id] = item;
      item.on("load", () => {
        item.rate(engine.getPlayRate());
        item.seek(time - startTime);
      });
    }

    const timeListener = (data: { time: number }) => {
      const { time } = data;
      item.seek(time - startTime);
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.rate(rate);
    };
    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on("afterSetTime", timeListener);
    engine.on("afterSetPlayRate", rateListener);
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
}

export default new AudioControl();
