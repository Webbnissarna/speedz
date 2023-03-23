import { useEffect, useMemo, useRef, useState } from "react";
import Label from "./Label";

export default function ComboboxMultiple({
  options,
  defaultText,
  name,
  placeholder,
  error,
  allowCreation = false,
}: {
  options: Array<string>;
  defaultText: string;
  name: string;
  placeholder: string;
  error: string | null | undefined;
  allowCreation?: boolean;
}) {
  function getFilteredOptions(
    selectedItems: Array<string>,
    inputValue: string
  ) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return options.filter(function filterOption(option) {
      return (
        !selectedItems.includes(option) &&
        option.toLowerCase().includes(lowerCasedInputValue)
      );
    });
  }
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);
  const items = useMemo(
    () => getFilteredOptions(selectedItems, inputValue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItems, inputValue]
  );
  const ref = useRef<HTMLUListElement | null>(null);

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    console.log(e.code);
    e.preventDefault();
    switch (e.code) {
      case "ArrowDown":
        if (highlightedItem !== null) {
          setHighlightedItem((highlightedItem + 1) % items.length);
        } else {
          setHighlightedItem(0);
        }
        break;
      case "ArrowUp":
        if (highlightedItem !== null) {
          if (highlightedItem === 0) {
            setHighlightedItem(null);
          } else {
            setHighlightedItem((highlightedItem - 1) % items.length);
          }
        } else {
          setHighlightedItem(items.length - 1);
        }
        break;
      case "Enter":
        if (highlightedItem !== null) {
          setSelectedItems([...selectedItems, items[highlightedItem]]);
          setOpen(false);
        }
        if (allowCreation && e.currentTarget.value.length > 0) {
          setSelectedItems([...selectedItems, e.currentTarget.value]);
          setInputValue("");
          setOpen(false);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
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
        <Label title={name} />
        {selectedItems.map((item, idx) => {
          return (
            <input
              key={`${item}${idx}`}
              hidden
              readOnly
              value={item}
              name={name}
            />
          );
        })}
        <div>
          <div className="flex gap-3 py-2">
            {selectedItems.map((item, idx) => {
              return (
                <div
                  key={`${item}${idx}`}
                  className="relative flex cursor-default gap-2 border border-amber-300 p-2"
                >
                  <span>{item}</span>
                  <span
                    className="absolute right-[-0.5rem] top-[-0.5rem] cursor-pointer"
                    onClick={(e) => {
                      setSelectedItems(
                        selectedItems.filter(
                          (selectedItem) => selectedItem !== item
                        )
                      );
                    }}
                  >
                    🙅‍♂️
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex w-full items-center justify-between border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 py-4 px-4">
            <input
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.currentTarget.value);
              }}
              value={inputValue}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                setOpen(true);
              }}
              className="placeholder:typo-body bg-transparent placeholder:text-amber-200/50"
            />
            <span onClick={() => setOpen(!isOpen)} className="cursor-pointer">
              {isOpen ? "☝️" : "👇"}
            </span>
          </div>
        </div>
      </div>
      {isOpen ? (
        <ul
          ref={ref}
          className="absolute top-[110%] left-0 right-0 max-h-28 overflow-y-scroll rounded-lg bg-amber-100/25 p-2"
        >
          {items.map((option, idx) => {
            return (
              <li
                className={`cursor-pointer hover:bg-slate-600 ${
                  idx === highlightedItem ? "bg-slate-600" : ""
                }`}
                key={`${option}${idx}`}
                onClick={() => {
                  setSelectedItems([...selectedItems, option]);
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      ) : null}
      {error && <span className="font-bold text-red-600">{error}</span>}
    </div>
  );
}
