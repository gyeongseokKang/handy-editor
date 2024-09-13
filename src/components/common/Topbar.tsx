import Link from "next/link";

interface TopbarProps {}

const Topbar = ({}: TopbarProps) => {
  return (
    <header className="bg-gray-900 p-4 text-white h-16">
      <Link href="/">
        <h1 className="text-xl font-bold">Online Media Editor</h1>
      </Link>
    </header>
  );
};

export default Topbar;
