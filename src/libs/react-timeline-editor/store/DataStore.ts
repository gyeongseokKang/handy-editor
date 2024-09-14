import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_ROW_HEIGHT } from "../interface/const";
import { TimelineRow, TimelineSegment } from "../interface/segment";

type State = {
  timelineRowList: TimelineRow[];
};

type Actions = {
  setTimelineRowList: (timelineRowList: State["timelineRowList"]) => void;
  addTimelineRow: (timelineRow: TimelineRow) => void;
  updateSegment: (segment: TimelineSegment) => void;
  reset: () => void;
};

const initialState: State = {
  timelineRowList: [
    // {
    //   id: "row1",
    //   segments: [
    //     {
    //       id: "audio_18분짜리",
    //       start: 0,
    //       end: 1167,
    //       effectId: "audioPlayer",
    //       data: {
    //         src: "/video/18min_mix_.wav",
    //         name: "18min_mix_",
    //         videoSrc: "/video/18min_mix_.wav",
    //       },
    //     },
    //   ],
    // },
    // {
    //   id: "row2",
    //   segments: [
    //     {
    //       id: "video_18분짜리",
    //       start: 0,
    //       end: 1167,
    //       effectId: "videoPlayer",
    //       data: {
    //         src: "/video/18분짜리 인터뷰.mp4",
    //         name: "18분짜리 인터뷰",
    //         videoSrc: "/video/18분짜리 인터뷰.mp4",
    //       },
    //     },
    //   ],
    // },
  ],
};

const useDataStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    setTimelineRowList: (timelineRowList) =>
      set((state) => {
        state.timelineRowList = timelineRowList;
      }),
    addTimelineRow: (timelineRow: TimelineRow) =>
      set((state) => {
        if (state.timelineRowList.find((row) => row.id === timelineRow.id)) {
          return;
        }
        state.timelineRowList.push(timelineRow);
      }),
    updateSegment: (segment: TimelineSegment) => {
      set((state) => {
        state.timelineRowList.forEach((row) => {
          row.segments.forEach((seg, index) => {
            if (seg.id === segment.id) {
              row.segments[index] = segment;
            }
          });
        });
      });
    },
    reset: () => set(initialState),
  }))
);

export default useDataStore;

export class DataStoreUtil {
  static makeTimelineRow() {
    const newTimelineRow: TimelineRow = {
      id: "row" + crypto.randomUUID(),
      segments: [],
      rowHeight: DEFAULT_ROW_HEIGHT,
      selected: true,
      classNames: [],
    };
    return newTimelineRow;
  }

  static copySegment({
    segment,
    type,
  }: {
    segment: TimelineSegment;
    type: "newLine" | "sameLine";
  }) {
    const timelineRowList = structuredClone(
      useDataStore.getState().timelineRowList
    );

    if (type === "newLine") {
      const newTimelineRow = DataStoreUtil.makeTimelineRow();
      newTimelineRow.segments.push({
        ...segment,
        id: "copy" + crypto.randomUUID(),
      });
      return [...timelineRowList, newTimelineRow];
    }

    const newTimelineRowList = timelineRowList.map((row) => {
      if (row.segments.find((seg) => seg.id === segment.id)) {
        row.segments.push({
          ...segment,

          start: segment.end,
          end: segment.end + segment.end,
          id: "copy" + crypto.randomUUID(),
        });
      }
      return row;
    });

    return newTimelineRowList;
  }

  static copyAndUpdateSegment({
    segment,
    type,
  }: {
    segment: TimelineSegment;
    type: "newLine" | "sameLine";
  }) {
    const newTimelineRowList = DataStoreUtil.copySegment({ segment, type });
    useDataStore.getState().setTimelineRowList(newTimelineRowList);
  }

  static deleteSegment({ segment }: { segment: TimelineSegment }) {
    const timelineRowList = useDataStore.getState().timelineRowList;
    const newTimelineRowList = timelineRowList.map((row) => {
      return {
        ...row,
        segments: row.segments.filter((seg) => seg.id !== segment.id),
      };
    });
    return newTimelineRowList;
  }

  static deleteAndUpdateSegment({ segment }: { segment: TimelineSegment }) {
    const newTimelineRowList = DataStoreUtil.deleteSegment({ segment });
    useDataStore.getState().setTimelineRowList(newTimelineRowList);
  }

  static dragSegment({
    segment,
    start,
    end,
  }: {
    segment: TimelineSegment;
    start: number;
    end: number;
  }) {
    const newSegment = { ...segment, start, end };
    return newSegment;
  }
  static updateSegment(segment: TimelineSegment) {
    useDataStore.getState().updateSegment(segment);
  }

  static dragAndUpdateSegment({
    segment,
    start,
    end,
  }: {
    segment: TimelineSegment;
    start: number;
    end: number;
  }) {
    const newSegment = DataStoreUtil.dragSegment({ segment, start, end });
    DataStoreUtil.updateSegment(newSegment);
  }
}
