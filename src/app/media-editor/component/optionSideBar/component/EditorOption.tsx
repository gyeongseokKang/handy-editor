import useOptionStore from "@/app/media-editor/store/OptionStore";
import SelectOption from "./option/SelectOption";

const EditorOption = () => {
  const editorOption = useOptionStore((state) => state.editorOption);
  const { scaleState } = editorOption;
  return (
    <div className="w-full flex flex-col gap-2 p-2">
      <SelectOption
        label="Scale Per Section"
        value={scaleState.scale}
        description="Select the scale of the timeline"
        itemlist={[5, 20, 60, 180, 300, 600]}
        onSelect={(item) => {
          useOptionStore.getState().updateScaleState({
            scale: Number(item),
          });
        }}
        itemSuffix="s"
      />
      <SelectOption
        label="Scale Width"
        value={scaleState.scaleWidth}
        description="Select the scale of the timeline"
        itemlist={[150, 300, 450, 600]}
        onSelect={(item) => {
          useOptionStore.getState().updateScaleState({
            scaleWidth: Number(item),
          });
        }}
        itemSuffix="px"
      />
      <SelectOption
        label="Scale Tick"
        value={scaleState.scaleSplitCount}
        description="Select the scale of the timeline"
        itemlist={[10, 20, 30, 60]}
        onSelect={(item) => {
          useOptionStore.getState().updateScaleState({
            scaleSplitCount: Number(item),
          });
        }}
      />
    </div>
  );
};

export default EditorOption;
