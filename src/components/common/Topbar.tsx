import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { Separator } from "../ui/separator";
import { ToggleThemeButton } from "./ToggleThemeButton";

const Topbar = () => {
  return (
    <>
      <header className="p-4 h-16 flex items-center ">
        <Link href="/">
          <h1 className="text-xl font-bold">Online Media Editor</h1>
        </Link>
        <div className="ml-auto flex gap-4 items-center">
          <ToggleThemeButton />
          <Link
            href="https://github.com/gyeongseokKang/online-media-editor"
            target="_blank"
          >
            <FaGithub size={30} />
          </Link>
        </div>
      </header>
      <Separator className="w-full pt-0 mt-0" />
    </>
  );
};

export default Topbar;
