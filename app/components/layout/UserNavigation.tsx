import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { LogOut, User } from "../icons";

export default function UserNavigation() {
  const user = useOptionalUser();
  return (
    <nav className="flex w-full justify-end p-4" aria-label="user navigation">
      {user ? (
        <div className="flex gap-2">
          <Form action="/logout" method="post">
            <button type="submit" className="hover:text-amber-200">
              <LogOut />
            </button>
          </Form>
          <Link className="hover:text-amber-200" to="/account">
            <User />
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/join"
            className="border border-amber-200 p-2 hover:border-amber-50 hover:bg-gradient-to-br hover:from-amber-200/50 hover:to-transparent"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="border border-amber-200 p-2 hover:border-amber-50 hover:bg-gradient-to-bl hover:from-amber-200/50 hover:to-transparent"
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
}
