import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="min-h-screen sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
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
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
