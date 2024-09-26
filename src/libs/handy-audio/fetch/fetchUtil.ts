let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    if (window.AudioContext) {
      audioContext = new AudioContext();
    } else if ((window as any).webkitAudioContext) {
      audioContext = new (window as any).webkitAudioContext();
    } else {
      throw new Error("Web Audio API is not supported in this browser.");
    }
  }
  return audioContext;
}

// Fetch and decode audio buffer function
export async function fetchAudioBuffer(
  url: string
): Promise<AudioBuffer | undefined> {
  try {
    const audioContext = getAudioContext(); // Get the audio context (only initialized once)
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error("Error fetching or decoding audio:", error);
    return undefined;
  }
}
