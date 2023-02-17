import { Link } from "@remix-run/react";

export default function AdminIndex() {
  return (
    <div className="">
      <Link
        to="new"
        className="block w-fit border border-amber-400 p-4 hover:border-amber-200 hover:bg-gradient-to-br hover:from-amber-200/50 hover:to-transparent hover:text-amber-500"
      >
        Create a New Record
      </Link>
    </div>
  );
}
