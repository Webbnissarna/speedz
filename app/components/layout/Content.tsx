import React from "react";

type ContentProps = {
  children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
  return (
    <div
      id="layout-content"
      className="col-span-6 md:col-span-4 md:col-start-2  md:p-4"
    >
      {children}
    </div>
  );
}
