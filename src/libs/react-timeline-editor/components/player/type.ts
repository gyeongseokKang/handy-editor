import { TimelineAction, TimelineRow } from "../../interface/action";

export interface CustomTimelineAction extends TimelineAction {
  data: {
    id?: string;
    src: string;
    peak?: string;
    name: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}
