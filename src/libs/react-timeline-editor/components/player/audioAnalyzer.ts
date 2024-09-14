// AudioAnalyzerClass.ts (오디오 분석 클래스)
export class AudioAnalyzerClass {
  private analyserNode: AnalyserNode | null;
  public connectedList: AudioNode[] = [];

  constructor() {
    this.analyserNode = null;
    this.connectedList = [];
  }

  // AnalyserNode를 외부에서 받아와 초기화하는 메서드
  initNode(analyserNode: AnalyserNode) {
    if (!this.analyserNode) {
      this.analyserNode = analyserNode;
    }

    // AnalyserNode의 connect 메서드를 래핑하여 연결을 감지
    const originalConnect = this.analyserNode.connect.bind(this.analyserNode);
    (this.analyserNode as any).connect = (...args: AudioDestinationNode[]) => {
      originalConnect(...args);

      if (
        args[0] instanceof AudioNode &&
        !this.connectedList.includes(args[0])
      ) {
        this.connectedList.push(args[0]);
      }
      this.onConnect(); // 연결 시 호출될 메서드
    };

    // AnalyserNode의 disconnect 메서드를 래핑하여 연결 해제를 감지
    const originalDisconnect = this.analyserNode.disconnect.bind(
      this.analyserNode
    );
    (this.analyserNode as any).disconnect = (...args: any[]) => {
      originalDisconnect(...args);

      if (args[0] instanceof AudioNode) {
        const index = this.connectedList.indexOf(args[0]);
        if (index !== -1) {
          this.connectedList.splice(index, 1);
        }
      }
      this.onDisconnect(); // 연결 해제 시 호출될 메서드
    };

    this.analyserNode.fftSize = 2048; // fftSize 설정
    return this.analyserNode;
  }

  // 연결될 때 호출되는 콜백 함수 (필요에 따라 수정 가능)
  onConnect() {
    // console.log(
    //   `New connection detected! Total connections: ${this.connectedList.length}`
    // );
  }

  onDisconnect() {
    // console.log(
    //   `Connection disconnected! Total connections: ${this.connectedList.length}`
    // );
  }

  // AnalyserNode의 주파수 데이터를 데시벨 단위로 가져오는 메서드
  getDecibelData(): Float32Array | null {
    if (!this.analyserNode) return null;
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyserNode.getFloatFrequencyData(dataArray); // 주파수 데이터를 dB로 가져옴
    return dataArray;
  }

  // analyserNode 자체를 반환하는 메서드
  getNode(): AnalyserNode | null {
    return this.analyserNode;
  }
}

export const audioAnalyzer = new AudioAnalyzerClass();
