import { useState } from "react";
import Label from "./Label";

export default function NumberInput({
  title,
  error,
  defaultValue = 1,
}: {
  title: string;
  error?: string | null;
  defaultValue?: number;
}) {
  const [value, setValue] = useState<number>(defaultValue);
  const [active, setActive] = useState<boolean>(false);
  return (
    <div
      className="w-full max-w-[350px]"
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <Label title={title} active={active} />
      <input type={"hidden"} value={value} name={title} />
      <input
        onChange={(e) => {
          e.preventDefault();
          const parsedValue = parseInt(e.currentTarget.value);
          if (parsedValue) {
            console.log(parsedValue);
            setValue(parsedValue);
          }
          if (e.currentTarget.value.length === 0) {
            setValue(0);
          }
        }}
        id={title}
        className="w-full border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 px-4 py-4"
      />
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
