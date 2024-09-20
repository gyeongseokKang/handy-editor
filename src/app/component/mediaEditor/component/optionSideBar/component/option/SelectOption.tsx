import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOptionProps<T> {
  label: string;
  description?: string;
  value: T;
  itemlist: T[];
  onSelect: (selected: T) => void;
  itemPrefix?: string;
  itemSuffix?: string;
}

export default function SelectOption({
  label,
  value,
  description,
  itemlist,
  onSelect,
  itemPrefix,
  itemSuffix,
}: SelectOptionProps<Number | string>) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle>{label}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col ">
          <Select
            value={value.toString()}
            onValueChange={(value) => {
              onSelect(value);
            }}
          >
            <SelectTrigger id={label}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {itemlist.map((item) => {
                return (
                  <SelectItem key={item.toString()} value={item.toString()}>
                    {itemPrefix}
                    {item.toString()}
                    {itemSuffix}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
