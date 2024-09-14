import { Howl } from "howler";
import { TimelineEngine } from "../../../engine/engine";
import { audioAnalyzer } from "../audioAnalyzer";

interface Window {
  webkitAudioContext: typeof AudioContext;
}

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
      timeUpdate?: (data: { currentTime: number }) => void;
    }
  > = {};

  start(data: {
    id: string;
    engine: TimelineEngine;
    src: string;
    startTime: number;
    time: number;
  }) {
    const { id, src, startTime, time, engine } = data;
    let audioItem: Howl;
    let videoItem: HTMLVideoElement;
    let analyserNode: AnalyserNode;
    if (this.cacheMap[id]) {
      audioItem = this.cacheMap[id].audioItem;
      videoItem = this.cacheMap[id].videoItem;
    } else {
      console.log("loadStart!!");
      engine.trigger("loadStart", { id });
      audioItem = new Howl({
        src,
        loop: false,
        autoplay: true,
        html5: true,
        preload: true,
      });

      videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;

      const gainNode: GainNode | HTMLVideoElement = (audioItem as any)
        ?._sounds[0]?._node;
      if (gainNode) {
        analyserNode = audioAnalyzer.initNode(Howler.ctx.createAnalyser());
        if ("connect" in gainNode) {
          gainNode.connect(analyserNode);
          analyserNode.connect(Howler.ctx.destination);
        } else {
          const source = Howler.ctx.createMediaElementSource(gainNode);
          source.connect(analyserNode);
          analyserNode.connect(Howler.ctx.destination);
        }
      }

      this.cacheMap[id] = {
        audioItem: audioItem,
        videoItem: videoItem,
      };

      audioItem.on("load", () => {
        console.log("load!!");
        engine.trigger("loadEnd", { id });
        const currentTime = engine.getTime();
        audioItem.rate(engine.getPlayRate());
        audioItem.seek(currentTime - startTime);
      });
    }

    audioItem.rate(engine.getPlayRate());
    audioItem.seek(time - startTime);
    audioItem.play();
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

      if (
        currentTime - startTime > 0 &&
        Math.abs(currentTime - currentVideoTimeOffset) > 0.25
      ) {
        videoItem.currentTime = currentTime - startTime;
      }
    };

    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on("timeUpdate", timeUpdateListener);
    engine.on("afterSetTime", timeListener);
    engine.on("afterSetPlayRate", rateListener);
    engine.on("stop", () => {
      analyserNode?.connect(Howler.ctx.destination);
    });
    videoItem.addEventListener("load", () => {
      videoItem.playbackRate = engine.getPlayRate();
      if (time - startTime > 0) {
        videoItem.currentTime = time - startTime;
      }
    });

    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
    this.listenerMap[id].timeUpdate = timeUpdateListener;
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
        this.listenerMap[id].timeUpdate &&
          engine.off("timeUpdate", this.listenerMap[id].timeUpdate);
        delete this.listenerMap[id];
      }
    }
  }

  enter(data: { id: string }) {
    const { id } = data;
    const videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
    if (!videoItem) {
      return;
    }
    videoItem.style.visibility = "visible";
  }

  leave(data: { id: string }) {
    const { id } = data;
    const videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
    if (!videoItem) {
      return;
    }
    videoItem.style.visibility = "hidden";
    videoItem.currentTime = 0;
  }
}

export default new VideoControl();
