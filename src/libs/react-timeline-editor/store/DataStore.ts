import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_ROW_HEIGHT } from "../interface/const";
import { TimelineRow, TimelineSegment } from "../interface/segment";

type State = {
  selectedSegmentList: TimelineSegment[];
  timelineRowList: TimelineRow[];
};

type Actions = {
  setTimelineRowList: (timelineRowList: State["timelineRowList"]) => void;
  addTimelineRow: (timelineRow: TimelineRow) => void;
  selectSegment: (segment: TimelineSegment) => void;
  updateSegment: (segment: TimelineSegment) => void;
  reset: () => void;
};

const aa: TimelineRow[] = Array.from({ length: 100 }).map((_, index) => {
  return {
    id: "row" + index,
    segments: [
      {
        id: "내손을잡아" + index,
        start: 0 + index * 50,
        end: 202 + index * 50,
        effectId: "audioPlayer",
        data: {
          startOffset: 0,
          src: "/audio/내손을잡아.mp3",
          name: "내손을잡아",
          videoSrc: "/audio/내손을잡아.mp3",
        },
      },
    ],
  };
});

const initialState: State = {
  selectedSegmentList: [],
  timelineRowList: [
    // {
    //   id: "row1",
    //   segments: Array.from({ length: 40 }).map((_, i) => {
    //     return {
    //       id: "내손을잡아" + i,
    //       start: 50 + i * 50,
    //       end: 202 + i * 50,
    //       effectId: "audioPlayer",
    //       data: {
    //         startOffset: 0,
    //         src: "/audio/내손을잡아.mp3",
    //         name: "내손을잡아",
    //         videoSrc: "/audio/내손을잡아.mp3",
    //       },
    //     };
    //   }),
    // },
    // ...aa,
    // {
    //   id: "row1",
    //   segments: [
    //     {
    //       id: "내손을잡아",
    //       start: 0,
    //       end: 202,
    //       effectId: "audioPlayer",
    //       data: {
    //         startOffset: 0,
    //         src: "/audio/내손을잡아.mp3",
    //         name: "내손을잡아",
    //         videoSrc: "/audio/내손을잡아.mp3",
    //       },
    //     },
    //   ],
    // },
    // ...Array.from({ length: 20 }).map((_, index) => {
    //   return {
    //     id: "row" + index,
    //     segments: [
    //       {
    //         id: "video_18분짜리" + index,
    //         start: 0 + index * 10,
    //         end: 100 + index * 10,
    //         effectId: "videoPlayer",
    //         data: {
    //           src: "/video/18분짜리 인터뷰.mp4",
    //           name: "18분짜리 인터뷰",
    //           videoSrc: "/video/18분짜리 인터뷰.mp4",
    //         },
    //       },
    //     ],
    //   };
    // }),
    // {
    //   id: "row2",
    //   segments: [
    //     {
    //       id: "video_18분짜리",
    //       start: 0,
    //       end: 1167,
    //       effectId: "videoPlayer",
    //       data: {
    //         startOffset: 0,
    //         src: "/video/18분짜리 인터뷰.mp4",
    //         name: "18분짜리 인터뷰",
    //         videoSrc: "/video/18분짜리 인터뷰.mp4",
    //       },
    //     },
    //   ],
    // },
    // {
    //   id: "row1",
    //   segments: [
    //     {
    //       id: "최애의아이",
    //       start: 0,
    //       end: 226,
    //       effectId: "audioPlayer",
    //       data: {
    //         src: "/audio/최애의아이.mp3",
    //         name: "최애의아이",
    //       },
    //     },
    //   ],
    // },
    // {
    //   id: "3",
    //   segments: [
    //     {
    //       id: "스트리밍",
    //       start: 0,
    //       end: 4008,
    //       effectId: "audioStreammingPlayer",
    //       data: {
    //         src: "https://d2u3ecdp9u36hp.cloudfront.net/music_replacement/2/20240829/dQNsCjxEoE0EJ8w=/web_convert%2FStreetFoodFighterEp01_SOV.mp3",
    //         peak: "https://d2u3ecdp9u36hp.cloudfront.net/music_replacement/2/20240829/dQNsCjxEoE0EJ8w=/web_convert%2FStreetFoodFighterEp01_SOV_48.json",
    //         name: "스트리밍(1시간 6분 48초)",
    //       },
    //     },
    //   ],
    // },
  ],
};

const useDataStore = create(
  immer<State & Actions>((set) => ({
    ...initialState,
    selectSegment: (segment) =>
      set((state) => {
        if (segment === undefined) {
          state.selectedSegmentList = [];
          return;
        }
        state.selectedSegmentList = [segment];
        // if (state.selectedSegmentList.length === 0) {
        //   state.selectedSegmentList.push(segment);
        //   return;
        // }

        // const prevSelectedRow = state.timelineRowList.find((row) =>
        //   row.segments.find((seg) => seg.id === state.selectedSegmentList[0].id)
        // );
        // const selectedRow = state.timelineRowList.find((row) =>
        //   row.segments.find((seg) => seg.id === segment.id)
        // );
        // if (prevSelectedRow !== selectedRow) {
        //   state.selectedSegmentList = [segment];
        //   return;
        // }

        // if (state.selectedSegmentList.find((seg) => seg.id === segment.id)) {
        //   return;
        // }

        // state.selectedSegmentList.push(segment);
      }),
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
      selected: false,
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
    const timelineRowList = [...useDataStore.getState().timelineRowList];

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

  static selectSegment(segment: TimelineSegment | undefined) {
    useDataStore.getState().selectSegment(segment);
  }

  static splitSegment({
    segment,
    splitTime,
  }: {
    segment: TimelineSegment;
    splitTime: number;
  }) {
    const newSegment = { ...segment, end: splitTime };
    const newSegment2 = {
      ...segment,
      start: splitTime,
      data: {
        ...segment.data,
        startOffset: splitTime,
      },
      id: "split_" + crypto.randomUUID(),
    };
    const timelineRowList = useDataStore.getState().timelineRowList;
    const newTimelineRowList = timelineRowList.map((row) => {
      return {
        ...row,
        segments: row.segments.map((seg) => {
          if (seg.id === segment.id) {
            return newSegment;
          }
          return seg;
        }),
      };
    });

    newTimelineRowList.forEach((row) => {
      if (row.segments.find((seg) => seg.id === segment.id)) {
        row.segments.push(newSegment2);
      }
    });

    useDataStore.getState().setTimelineRowList(newTimelineRowList);
    DataStoreUtil.selectSegment(newSegment2);
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
    DataStoreUtil.selectSegment(newSegment);
    DataStoreUtil.updateSegment(newSegment);
  }
}
