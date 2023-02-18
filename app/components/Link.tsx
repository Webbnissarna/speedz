import React from "react";
import { Link as RemixLink } from "@remix-run/react";

export default function Link({
  to,
  relative,
  children = "route",
}: {
  to: string;
  relative?: "path" | "route";
  children: React.ReactNode;
}) {
  return (
    <RemixLink
      to={to}
      relative={relative}
      className="border border-amber-400 p-4 hover:animate-pulse hover:border-amber-200 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-transparent hover:text-amber-400"
    >
      {children}
    </RemixLink>
  );
}
