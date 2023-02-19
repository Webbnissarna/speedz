import React from "react";

type ContentProps = {
  children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
  return <div className="col-span-3 pt-4 md:col-span-2 md:p-4">{children}</div>;
}
