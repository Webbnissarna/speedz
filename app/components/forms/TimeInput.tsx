import React, { useState } from "react";
import Label from "./Label";

type Props = {
  name: string;
  error?: string | null;
};

export default function TimeInput({ name, error }: Props) {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState<string>("");
  return (
    <div
      onFocus={() => {
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
      className="w-full max-w-[350px]"
    >
      <Label title={name} active={active} />
      <input
        type={"text"}
        name={name}
        value={time}
        onKeyDown={(e) => {
          //Handle deletion
          if (e.code === "Backspace") {
            if (time.length > 0) {
              if (time.length === 3) {
                setTime(time.slice(0, -2));
                return;
              } else {
                setTime(time.slice(0, -1));
              }
            }
            return;
          }

          //Check if input is number
          const isInputNumber = !isNaN(Number(e.key));
          if (!isInputNumber) {
            return;
          }

          //Handle input
          if (time.length < 5) {
            switch (time.length) {
              case 0:
              case 3:
                if (Number(e.key) <= 5) {
                  setTime(time + e.key);
                  return;
                }
                break;
              case 1:
                setTime(time + e.key + ":");
                break;

              case 4:
                setTime(time + e.key);
                break;
            }
          }
        }}
        onChange={(e) => {}}
        placeholder={"MM:SS"}
        className="placeholder:typo-body w-full border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 px-4 py-4 text-amber-200 placeholder:text-amber-200/50"
      />
      {error && time.length < 5 ? (
        <span className="text-red-600">{error}</span>
      ) : null}
    </div>
  );
}
