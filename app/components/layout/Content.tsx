import React from "react";

type ContentProps = {
  children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
  return <div className="col-span-3 md:col-span-2">{children}</div>;
}
