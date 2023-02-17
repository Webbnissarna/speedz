import { Link } from "@remix-run/react";
import UserNavigation from "~/components/layout/UserNavigation";

export default function Index() {
  return (
    <div>
      <UserNavigation />
      <main className="min-h-screen sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          <div className="flex flex-col gap-4">
            <Link
              to={"/records"}
              className={
                "rounded-md bg-amber-300 p-3 font-bold text-white hover:bg-amber-100 hover:text-black"
              }
            >
              View record entries
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
