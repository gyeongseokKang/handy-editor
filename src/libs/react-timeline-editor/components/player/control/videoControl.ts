import WaveSurfer from "wavesurfer.js";
import { TimelineEngine } from "../../../engine/engine";
import { audioAnalyzer } from "../audioAnalyzer";

class VideoControl {
  cacheMap: Record<
    string,
    {
      audioItem: WaveSurfer;
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
    startOffset: number;
    time: number;
  }) {
    const { id, src, startTime, time, engine, startOffset } = data;
    let audioItem: WaveSurfer;
    let videoItem: HTMLVideoElement;
    let analyserNode: AnalyserNode;
    if (this.cacheMap[id]) {
      audioItem = this.cacheMap[id].audioItem;
      videoItem = this.cacheMap[id].videoItem;
    } else {
      engine.trigger("loadStart", { id });
      audioItem = WaveSurfer.create({
        url: src,
        container: document.querySelector(`#ws_${id}`) as HTMLElement,
        waveColor: "#9E7FD9",
        progressColor: "#9E7FD9",
        height: 100,
        interact: false,
        autoplay: true,
        hideScrollbar: true,
      });
      videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
      this.cacheMap[id] = {
        audioItem: audioItem,
        videoItem: videoItem,
      };
    }

    const seekTime = time - startTime + startOffset;
    audioItem.setPlaybackRate(engine.getPlayRate());
    audioItem.setTime(seekTime);
    audioItem.play();
    videoItem.currentTime = seekTime;
    videoItem.play();
    const timeListener = (data: { time: number }) => {
      const { time } = data;
      const seekTime = time - startTime + startOffset;
      audioItem.setTime(seekTime);
      videoItem.currentTime = seekTime;
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      audioItem.setPlaybackRate(rate);
      videoItem.playbackRate = rate;
    };

    const timeUpdateListener = (data: { currentTime: number }) => {
      const { currentTime } = data;
      const currentVideoTimeOffset =
        videoItem.currentTime + startTime - startOffset;

      if (
        seekTime > 0 &&
        Math.abs(currentTime - currentVideoTimeOffset) > 0.25
      ) {
        const seekTime = currentTime - startTime + startOffset;
        videoItem.currentTime = seekTime;
      }
    };

    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on("timeUpdate", timeUpdateListener);
    engine.on("afterSetTime", timeListener);
    engine.on("afterSetPlayRate", rateListener);
    // engine.on("stop", () => {
    //   analyserNode?.connect(Howler.ctx.destination);
    // });
    videoItem.addEventListener("load", () => {
      videoItem.playbackRate = engine.getPlayRate();
      if (time - startTime > 0) {
        const seekTime = time - startTime + startOffset;
        videoItem.currentTime = seekTime;
      }
    });
    audioItem.on("load", () => {
      const currentTime = engine.getTime();
      const seekTime = currentTime - startTime + startOffset;
      audioItem.setPlaybackRate(engine.getPlayRate());
      audioItem.setTime(seekTime);
      videoItem.currentTime = seekTime;
      // this.connectAnalyser(audioItem);
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

  update(data: {
    id: string;
    isPlaying: boolean;
    time: number;
    startTime: number;
    startOffset: number;
  }) {
    const { id, isPlaying, time, startTime, startOffset } = data;
    if (!isPlaying) {
      const videoItem = document.querySelector(`#${id}`) as HTMLVideoElement;
      if (!videoItem) {
        return;
      }

      const seekTime = time - startTime + startOffset;
      videoItem.currentTime = seekTime;
    }
  }

  load({
    id,
    src,
    engine,
  }: {
    id: string;
    src: string;
    engine: TimelineEngine;
  }) {
    const item = WaveSurfer.create({
      url: src,
      container: document.querySelector(`#ws_${id}`) as HTMLElement,
      waveColor: "#9E7FD9",
      progressColor: "#9E7FD9",
      height: 100,
      interact: false,
      autoplay: false,
      hideScrollbar: true,
    });
    item.on("decode", () => {
      item.setPlaybackRate(engine.getPlayRate());
      engine.trigger("loadEnd", { id, audioBuffer: item.getDecodedData() });
    });

    if (!this.cacheMap[id]) {
      this.cacheMap[id] = {
        audioItem: item,
        videoItem: document.querySelector(`#${id}`) as HTMLVideoElement,
      };
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

export default new VideoControl();
