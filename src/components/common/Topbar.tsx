import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
interface TopbarProps {}

const Topbar = ({}: TopbarProps) => {
  return (
    <header className="bg-gray-900 p-4 text-white h-16 flex items-center">
      <Link href="/">
        <h1 className="text-xl font-bold">Online Media Editor</h1>
      </Link>
      <Link
        className="ml-auto"
        href="https://github.com/gyeongseokKang/online-media-editor"
        target="_blank"
      >
        <FaGithub size={30} />
      </Link>
    </header>
  );
};

export default Topbar;
