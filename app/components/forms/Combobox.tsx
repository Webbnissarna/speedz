import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const ref = useRef<HTMLUListElement | null>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

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
            className="cursor-pointer"
          >
            {isOpen ? "☝️" : "👇"}
          </span>
        </div>
      </div>
      {isOpen ? (
        <ListBoxRef
          ref={ref}
          highlightedItem={highlightedItem}
          items={filtered}
          setHighlightedItem={setHighlightedItem}
          setOpen={setOpen}
          setSelectedItem={setSelectedItem}
        />
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

type ListBoxProps = {
  setOpen: React.Dispatch<boolean>;
  items: Array<string>;
  setHighlightedItem: React.Dispatch<number | null>;
  setSelectedItem: React.Dispatch<string>;
  highlightedItem: number | null;
};

const ListBoxRef = React.forwardRef<HTMLUListElement, ListBoxProps>(
  function ListBox(
    {
      setOpen,
      items,
      setHighlightedItem,
      setSelectedItem,
      highlightedItem,
    }: ListBoxProps,
    ref
  ) {
    return (
      <ul
        ref={ref}
        className="absolute top-[110%] left-0 right-0 z-10 max-h-28 overflow-y-scroll rounded-lg bg-gradient-to-tr from-amber-50 to-amber-100 p-2"
      >
        {items.map((option, idx) => {
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
    );
  }
);
