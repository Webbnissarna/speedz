import { Link } from "@remix-run/react";
import React from "react";
import { Add } from "~/components/icons";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl">Add new record</span>
        <Link to="new" className="hover:text-amber-200">
          <Add width={40} height={40} />
        </Link>
      </div>
    );
  } else {
    return <p>Log in to add new records</p>;
  }
}
