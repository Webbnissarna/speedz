import React from "react";
import Label from "./Label";

type Props = {
  name: string;
  placeholder: string;
};

export default function Textarea({ name, placeholder }: Props) {
  return (
    <div className="w-max-[350px] w-full">
      <Label title={name} />
      <textarea
        className="placeholder:typo-body h-28 w-full resize-none border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 px-4 py-4 text-amber-200 placeholder:text-amber-200/50"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}
