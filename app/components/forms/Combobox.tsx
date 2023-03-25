import React, { useEffect, useMemo, useRef, useState } from "react";
import ComboboxMenu from "./ComboboxMenu";
import Label from "./Label";

type ComboboxProps = {
  options: Array<string>;
  defaultText: string;
  name: string;
  error?: string | null;
  setValue: (value: string) => void;
};

export default function ComboboxInput({
  defaultText,
  options,
  name,
  error,
  setValue,
}: ComboboxProps) {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [textInput, setTextInput] = useState("");
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLUListElement | null>(null);
  const toggleRef = useRef<HTMLSpanElement | null>(null);

  const filtered = useMemo(
    () =>
      options.filter((option) => {
        const filtered = option.toLowerCase().includes(textInput);
        return filtered;
      }),
    [options, textInput]
  );

  useEffect(() => {
    setValue(selectedItem);
  }, [selectedItem, setValue]);

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
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        //@ts-ignore
        if (!toggleRef.current?.contains(event.target)) {
          console.log("close");
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      className="relative w-full"
      onFocus={() => {
        setActive(true);
        setOpen(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
    >
      <div className="flex flex-col items-center">
        {selectedItem.length > 0 ? (
          <input readOnly hidden name={name} value={selectedItem} />
        ) : null}

        <Label title={name} active={active} />
        {selectedItem.length > 0 && <SelectedItem item={selectedItem} />}
        <div className="relative w-full">
          <div className="flex w-full items-center justify-between border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 py-4 px-4">
            <input
              type="text"
              onChange={(e) => {
                setTextInput(e.currentTarget.value);
              }}
              onKeyDown={handleKeyPress}
              placeholder={defaultText}
              onBlur={() => {
                setHighlightedItem(null);
              }}
              className="placeholder:typo-body w-full bg-transparent placeholder:text-amber-200/50"
            />
            <span
              className={`cursor-pointer transition-transform duration-300 ${
                isOpen && "rotate-180 transform"
              }`}
              onClick={() => {
                setOpen(!isOpen);
              }}
              ref={toggleRef}
            >
              👇
            </span>
          </div>
          {isOpen ? (
            <ComboboxMenu
              items={filtered}
              ref={ref}
              listItemClick={(item: string) => {
                setSelectedItem(item);
                setOpen(false);
              }}
            />
          ) : null}
        </div>
      </div>

      {error && selectedItem === "" ? (
        <span className="text-red-600">{error}</span>
      ) : null}
    </div>
  );
}

function SelectedItem({ item }: { item: string }) {
  return (
    <div className="flex gap-2 p-5">
      <span className="animate-scale">👌</span>
      <span className="truncate" title={item}>
        {item}
      </span>
      <span className="animate-scale">👌</span>
    </div>
  );
}
