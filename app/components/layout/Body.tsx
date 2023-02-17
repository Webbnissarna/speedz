import React from "react";

type BodyProps = {
  children: React.ReactNode;
};

export default function Body({ children }: BodyProps) {
  return <div className="grid grid-cols-3">{children}</div>;
}
