import React from "react";

type ContentProps = {
  children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
  return (
    <div id="layout-content" className="col-span-3 md:col-span-2 md:p-4">
      {children}
    </div>
  );
}
