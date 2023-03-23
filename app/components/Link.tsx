import React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";

export default function Link(props: LinkProps) {
  return (
    <RemixLink
      {...props}
      className="flex items-center border border-amber-400 p-4 hover:animate-pulse hover:border-amber-200 hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-transparent hover:text-amber-400"
    >
      {props.children}
    </RemixLink>
  );
}
