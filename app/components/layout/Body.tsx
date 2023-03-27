import React from "react";

type BodyProps = {
  children: React.ReactNode;
  header?: string;
};

export default function Body({ children, header }: BodyProps) {
  return (
    <div id="layout-body" className="grid grid-cols-6">
      {children}
    </div>
  );
}
