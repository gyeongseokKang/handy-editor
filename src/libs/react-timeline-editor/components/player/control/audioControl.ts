import { Howl } from "howler";
import { TimelineEngine } from "../../../engine/engine";
import { audioAnalyzer } from "../audioAnalyzer";

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
    isLargefile?: boolean;
  }) {
    const { id, src, startTime, time, engine, isLargefile } = data;
    let item: Howl;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.rate(engine.getPlayRate());
      item.seek(time - startTime);
      item.play();
    } else {
      item = new Howl({
        src,
        loop: false,
        autoplay: true,
        ...(isLargefile && { format: ["mp3"] }),
      });

      this.cacheMap[id] = item;
      item.on("load", () => {
        this.connectAnalyser(item);
        item.rate(engine.getPlayRate());
        item.seek(time - startTime);
      });
    }

    const timeListener = (data: { time: number }) => {
      const { time } = data;
      if (time - startTime < 0) {
        delete this.listenerMap[id];
      } else {
        item.seek(time - startTime);
      }
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.rate(rate);
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
