import React from "react";

type BodyProps = {
  children: React.ReactNode;
  header?: string;
};

export default function Body({ children, header }: BodyProps) {
  return (
    <div id="layout-body" className="grid grid-cols-3 pt-6">
      {header && <h2 className="col-span-3 pb-4 text-center">{header}</h2>}
      {children}
    </div>
  );
}
