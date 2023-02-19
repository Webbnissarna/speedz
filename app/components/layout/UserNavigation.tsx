import { Form, Link as RemixLink } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { LogOut, User } from "../icons";
import Link from "../Link";

export default function UserNavigation() {
  const user = useOptionalUser();
  return (
    <nav
      className="col-span-3 flex w-full justify-end py-2 md:col-span-1 md:p-4"
      aria-label="user navigation"
    >
      {user ? (
        <div className="flex gap-2">
          <Form action="/logout" method="post" tabIndex={-1}>
            <button
              name="logout"
              type="submit"
              className="hover:text-amber-200"
            >
              <LogOut />
            </button>
          </Form>
          <RemixLink to="/account">
            <User />
          </RemixLink>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-1 md:gap-4">
          <div className="col-span-1">
            <Link to="/join">Sign up</Link>
          </div>
          <div>
            <Link to="/login">Log In</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
