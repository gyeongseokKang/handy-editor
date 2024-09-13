"use client";

import { mockData2 } from "@/libs/react-timeline-editor/components/player/mock";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { cloneDeep } from "lodash";

// duration 플러그인 사용 설정
dayjs.extend(duration);
const defaultEditorData = cloneDeep(mockData2);

export default function Home() {
  return <>뮤직 플레이스먼트</>;
}
