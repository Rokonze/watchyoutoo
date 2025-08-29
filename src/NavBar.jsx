import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white flex items-center justify-between p-4">
      <h1 className="text-lg font-bold">WatchYouToo</h1>
      <Link
        to="/"
        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
      >
        Home
      </Link>
    </nav>
  );
}