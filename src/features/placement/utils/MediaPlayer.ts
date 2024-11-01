import WaveSurfer from "wavesurfer.js";
import usePlayerStore from "../stores/PlayerStore";

export class MediaPlayer {
  video: HTMLVideoElement;
  waveSurfer: WaveSurfer;

  isPlaying = false;
  currentTime = 0;
  constructor({ waveSurfer, video }: { waveSurfer: WaveSurfer; video }) {
    this.waveSurfer = waveSurfer;
    this.setVideo(video);

    this.connectListeners();
    this.syncMedia();
  }

  setVideo(video: HTMLVideoElement) {
    this.video = video;
    this.video.muted = true;
  }

  init() {
    this.video.muted = true;
  }

  play() {
    this.waveSurfer.play();
    this.video?.play();
  }

  pause() {
    this.waveSurfer.pause();
    this.video?.pause();
  }

  seek(time: number) {
    this.waveSurfer.setTime(time);
    this.video.currentTime = time;
  }

  next() {
    const nextSegment = usePlayerStore
      .getState()
      .segmentList.find((segment) => segment.start > this.currentTime + 0.01);
    if (nextSegment) {
      this.seek(nextSegment.start);
      usePlayerStore.setState({ segment: nextSegment });
    }
  }

  prev() {
    const { segmentList } = usePlayerStore.getState();

    // 현재 구간을 찾습니다.
    const currentSegmentIndex = segmentList.findIndex(
      (segment) =>
        segment.start <= this.currentTime && this.currentTime < segment.end
    );

    // 현재 구간이 첫 번째 구간이 아니고, 이전 구간이 존재하는 경우에만 찾습니다.
    if (currentSegmentIndex > 0) {
      const prevSegment = segmentList[currentSegmentIndex - 1];
      this.seek(prevSegment.start);
      usePlayerStore.setState({ segment: prevSegment });
    }
  }

  setVolume(volume) {
    this.waveSurfer.setVolume(volume);
  }

  connectListeners() {
    this.waveSurfer.on("play", () => {
      usePlayerStore.setState({ isPlaying: true });

      this.isPlaying = true;
    });

    this.waveSurfer.on("pause", () => {
      usePlayerStore.setState({ isPlaying: false });
      this.isPlaying = false;
    });

    this.waveSurfer.on("finish", () => {
      usePlayerStore.setState({ isPlaying: false });
      this.isPlaying = false;
    });
  }

  syncMedia() {
    this.waveSurfer.on("timeupdate", (time) => {
      this.currentTime = time;
      if (this.isPlaying) {
        const audioTime = time;
        const videoTime = this.video.currentTime;
        if (Math.abs(videoTime - audioTime) > 0.25) {
          this.video.currentTime = audioTime;
        }
      }
    });

    this.waveSurfer.on("seeking", () => {
      const audioTime = this.waveSurfer.getCurrentTime();
      const videoTime = this.video.currentTime;
      if (Math.abs(videoTime - audioTime) > 0.25) {
        this.video.currentTime = audioTime;
      }
    });
  }
}
