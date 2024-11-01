import { match } from "ts-pattern";

import useOptionStore from "@/app/store/OptionStore";
import EditorOption from "./component/EditorOption";
import RowOption from "./component/RowOption";
import SegmentOption from "./component/SegmentOption";

interface OptionSideBarProps {}

const OptionSideBar = ({}: OptionSideBarProps) => {
  const optionType = useOptionStore((state) => state.optionType);

  const RenderOption = match(optionType)
    .with("editor", () => <EditorOption />)
    .with("row", () => <RowOption />)
    .with("segment", () => <SegmentOption />)
    .otherwise(() => <div></div>);

  return <div className="w-full h-full ">{RenderOption}</div>;
};

export default OptionSideBar;
