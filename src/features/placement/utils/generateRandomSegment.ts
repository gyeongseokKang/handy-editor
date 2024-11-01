export const generateRandomSegment = (
  duration
): {
  start: number;
  end: number;
  id: string;
}[] => {
  const minLength = 5;
  const maxLength = 30;
  const regions = [];

  // 5개의 랜덤 구간 길이 생성 (각 길이는 5초 이상, 30초 이하)
  let remainingDuration = duration;
  for (let i = 0; i < 5; i++) {
    const maxPossibleLength = Math.min(
      maxLength,
      remainingDuration - (5 - i - 1) * minLength
    );
    const segmentLength =
      Math.random() * (maxPossibleLength - minLength) + minLength;
    regions.push(segmentLength);
    remainingDuration -= segmentLength;
  }

  // 각 구간을 랜덤한 위치에 배치하면서 겹치지 않도록 함
  const result = [];
  let attempts = 0; // 무한 루프 방지용
  while (regions.length > 0 && attempts < 1000) {
    const segmentLength = regions.pop();
    const maxStart = duration - segmentLength;
    const randomStart = Math.random() * maxStart;

    // 새로운 구간이 기존 구간들과 겹치지 않도록 확인
    const isOverlapping = result.some(
      (region) =>
        !(
          randomStart + segmentLength <= region.start ||
          randomStart >= region.end
        )
    );

    if (!isOverlapping) {
      result.push({ start: randomStart, end: randomStart + segmentLength });
    } else {
      regions.push(segmentLength); // 겹치면 다시 시도
    }
    attempts++;
  }

  // 구간을 시작 위치 순서대로 정렬
  result.sort((a, b) => a.start - b.start);
  return result.map((result, index) => {
    return {
      start: result.start,
      end: result.end,
      id: (index + 1).toString(),
    };
  });
};
