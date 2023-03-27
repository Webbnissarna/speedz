import { Form, Link as RemixLink } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { LogOut, User } from "../icons";
import Link from "../Link";

export default function UserNavigation() {
  const user = useOptionalUser();
  return (
    <nav
      className="col-span-3 flex w-full justify-end md:col-span-1 md:p-4"
      aria-label="user navigation"
    >
      {user ? (
        <div className="absolute top-8 right-4 flex gap-2 ">
          <Form action="/logout" method="post" tabIndex={-1}>
            <button
              name="logout"
              type="submit"
              className="hover:text-amber-200"
            >
              <LogOut />
            </button>
          </Form>
          <RemixLink to="/account" className="hover:text-amber-200">
            <User />
          </RemixLink>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-1 pt-8 md:gap-4 ">
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
