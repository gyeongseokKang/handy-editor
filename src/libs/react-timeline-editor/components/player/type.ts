import { TimelineRow, TimelineSegment } from "../../interface/segment";

export interface CustomTimelineSegment extends TimelineSegment {
  data: {
    id?: string;
    src: string;
    peak?: string;
    name: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  segments: CustomTimelineSegment[];
}
