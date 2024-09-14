import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiUpload } from "react-icons/fi";

interface UploadDropdownProps {}

const UploadDropdown = ({}: UploadDropdownProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <FiUpload className="h-[1.2rem] w-[1.2rem] " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Label className="w-full" htmlFor="local-file-upload">
              로컬 파일 업로드(mp3만)
            </Label>
            <Input
              className="hidden"
              id="local-file-upload"
              type="file"
              accept=".mp3"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UploadDropdown;
