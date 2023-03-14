import { useMemo, useState } from "react";
import Label from "./Label";

type ComboboxProps = {
  options: Array<string>;
  defaultText: string;
  name: string;
  error?: string;
};

export default function ComboboxInput({
  defaultText,
  options,
  name,
  error,
}: ComboboxProps) {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [textInput, setTextInput] = useState("");
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      options.filter((option) => {
        const filtered = option.toLowerCase().includes(textInput);
        return filtered;
      }),
    [options, textInput]
  );

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.code) {
      case "ArrowDown":
        e.preventDefault();
        if (highlightedItem !== null) {
          setHighlightedItem((highlightedItem + 1) % filtered.length);
        } else {
          setHighlightedItem(0);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (highlightedItem !== null) {
          if (highlightedItem === 0) {
            setHighlightedItem(filtered.length - 1);
          } else {
            setHighlightedItem((highlightedItem - 1) % filtered.length);
          }
        } else {
          setHighlightedItem(filtered.length - 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedItem !== null) {
          setSelectedItem(filtered[highlightedItem]);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
      default:
        break;
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-col">
        {selectedItem.length > 0 ? (
          <input readOnly hidden name={name} value={selectedItem} />
        ) : null}

        <Label title={name} />
        {selectedItem.length > 0 && <SelectedItem item={selectedItem} />}
        <div className="flex w-full items-center justify-between border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 py-4 px-4">
          <input
            type="text"
            onChange={(e) => {
              setTextInput(e.currentTarget.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder={defaultText}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setHighlightedItem(null);
            }}
            className="placeholder:typo-body bg-transparent placeholder:text-amber-200/50"
          />
          <span
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            className=""
          >
            {isOpen ? "☝️" : "👇"}
          </span>
        </div>
      </div>
      {isOpen ? (
        <ul className="absolute top-[110%] left-0 right-0 rounded-lg bg-amber-100/25 p-2">
          {filtered.map((option, idx) => {
            return (
              <li
                key={`${option}${idx}`}
                className={`cursor-pointer ${
                  idx === highlightedItem ? "bg-slate-600" : ""
                }`}
                onMouseEnter={() => {
                  setHighlightedItem(idx);
                }}
                onClick={() => {
                  setSelectedItem(option);
                  setOpen(false);
                }}
              >
                {option.toLowerCase()}
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? <span className="text-red-600">{error}</span> : null}
    </div>
  );
}

function SelectedItem({ item }: { item: string }) {
  return (
    <div className="flex gap-2 p-5">
      <span>👉</span>
      <span className="truncate" title={item}>
        {item}
      </span>
      <span>👌</span>
    </div>
  );
}
