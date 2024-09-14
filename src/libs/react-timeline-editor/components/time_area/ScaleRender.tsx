import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
// duration 플러그인 사용 설정
dayjs.extend(duration);

interface ScaleRenderProps {
  second: number;
}

const ScaleRender = ({ second }: ScaleRenderProps) => {
  const timeDuration = dayjs.duration(second, "seconds");
  const hours = timeDuration.hours();

  // 시간에 따라 포맷을 다르게 설정
  if (hours > 0) {
    return (
      <div className="text-xs text-gray-500">
        {timeDuration.format("HH:mm:ss")}
      </div>
    );
  } else {
    return (
      <div className="text-xs text-gray-500">
        {timeDuration.format("mm:ss")}
      </div>
    );
  }
};

export default ScaleRender;
