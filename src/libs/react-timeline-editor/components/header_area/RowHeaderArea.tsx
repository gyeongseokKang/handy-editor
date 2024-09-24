import { AutoSizer, List } from "react-virtualized";
import {
  EDIT_ARED_DEFAULT_MARGIN_TOP,
  ROW_HEADER_DEFAULT_WIDTH,
  TIME_AREA_DEFAULT_HEIGHT,
} from "../../interface/const";
import { TimelineRow } from "../../interface/segment";

interface RowHeaderAreaProps {
  data: TimelineRow[];
  scrollTop: number;
}

const RowHeaderArea = ({ data, scrollTop }: RowHeaderAreaProps) => {
  const rowWidth = ROW_HEADER_DEFAULT_WIDTH;

  return (
    <AutoSizer>
      {({ height }) => {
        const listHeight =
          height - TIME_AREA_DEFAULT_HEIGHT - EDIT_ARED_DEFAULT_MARGIN_TOP;
        return (
          <>
            <div
              className="border-r flex items-center justify-center bg-gray-800"
              style={{
                width: rowWidth,
                height: TIME_AREA_DEFAULT_HEIGHT + EDIT_ARED_DEFAULT_MARGIN_TOP,
              }}
            ></div>
            <List
              className="!overflow-hidden border-r bg-gray-800"
              width={rowWidth}
              height={listHeight}
              rowCount={data.length}
              scrollTop={scrollTop}
              rowHeight={50}
              rowRenderer={({ key, index, style }) => {
                const row = data[index];
                return (
                  <div
                    key={key}
                    style={style}
                    className="min-h-[50px] text-white flex items-center justify-center"
                  >
                    row {index + 1}
                  </div>
                );
              }}
            />
          </>
        );
      }}
    </AutoSizer>
  );
};

export default RowHeaderArea;
