import { Howl } from "howler";
import { TimelineEngine } from "../../../engine/engine";
import { audioAnalyzer } from "../audioAnalyzer";

class VideoControl {
  cacheMap: Record<
    string,
    {
      audioItem: Howl;
      videoItem: HTMLVideoElement;
    }
  > = {};
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
    let audioItem: Howl;
    let videoItem: HTMLVideoElement;
    if (this.cacheMap[id]) {
      audioItem = this.cacheMap[id].audioItem;
      audioItem.rate(engine.getPlayRate());
      audioItem.seek(time - startTime);
      audioItem.play();

      videoItem = this.cacheMap[id].videoItem;
    } else {
      engine.trigger("loadStart", { id });
      audioItem = new Howl({
        src,
        loop: false,
        autoplay: true,
        ...(data.isStreamming && { html5: true }),
      });

      videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;

      const gainNode: GainNode = (audioItem as any)?._sounds[0]?._node;
      if (gainNode) {
        const analyserNode = audioAnalyzer.initNode(
          Howler.ctx.createAnalyser()
        );

        gainNode.connect(analyserNode);
        analyserNode.connect(Howler.ctx.destination);
      }

      this.cacheMap[id] = {
        audioItem: audioItem,
        videoItem: videoItem,
      };
      audioItem.on("load", () => {
        engine.trigger("loadEnd", { id });
        const currentTime = engine.getTime();
        audioItem.rate(engine.getPlayRate());
        audioItem.seek(currentTime - startTime);
      });
    }

    videoItem.currentTime = time - startTime;
    videoItem.play();
    const timeListener = (data: { time: number }) => {
      const { time } = data;
      audioItem.seek(time - startTime);
      videoItem.currentTime = time - startTime;
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      audioItem.rate(rate);
      videoItem.playbackRate = rate;
    };

    const timeUpdateListener = (data: { currentTime: number }) => {
      const { currentTime } = data;
      const currentVideoTimeOffset = videoItem.currentTime + startTime;
      if (Math.abs(currentTime - currentVideoTimeOffset) > 0.1) {
        console.log("sync~~");
        videoItem.currentTime = currentTime - startTime;
      }
    };

    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on("timeUpdate", timeUpdateListener);
    engine.on("afterSetTime", timeListener);
    engine.on("afterSetPlayRate", rateListener);
    videoItem.addEventListener("load", () => {
      videoItem.playbackRate = engine.getPlayRate();
      if (time - startTime > 0) {
        videoItem.currentTime = time - startTime;
      }
    });

    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  stop(data: { id: string; engine: TimelineEngine }) {
    const { id, engine } = data;
    if (this.cacheMap[id]) {
      const audioItem = this.cacheMap[id].audioItem;
      const videoItem = this.cacheMap[id].videoItem;
      audioItem.stop();
      videoItem.pause();
      if (this.listenerMap[id]) {
        this.listenerMap[id].time &&
          engine.off("afterSetTime", this.listenerMap[id].time);
        this.listenerMap[id].rate &&
          engine.off("afterSetPlayRate", this.listenerMap[id].rate);
        delete this.listenerMap[id];
      }
    }
  }

  enter(data: { id: string }) {
    const { id } = data;
    const videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
    videoItem.style.visibility = "visible";
  }

  leave(data: { id: string }) {
    const { id } = data;
    const videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
    videoItem.style.visibility = "hidden";
    videoItem.currentTime = 0;
  }
}

export default new VideoControl();
