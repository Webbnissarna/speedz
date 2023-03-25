import { useEffect, useMemo, useRef, useState } from "react";
import ComboboxMenu from "./ComboboxMenu";
import Label from "./Label";

type Option = {
  name: string;
  abbr: string;
};

export default function ComboboxMultiple({
  options,
  name,
  placeholder,
  error,
  allowCreation = false,
  maxSelectedItems,
}: {
  options: Array<Option>;
  defaultText: string;
  name: string;
  placeholder: string;
  error: string | null | undefined;
  allowCreation?: boolean;
  maxSelectedItems?: number;
}) {
  function getFilteredOptions(
    selectedItems: Array<string>,
    inputValue: string
  ) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return options.filter(function filterOption(option) {
      const lowerCasedOption = option.name.toLowerCase();
      if (
        Object.values(selectedItems).includes(option.name) ||
        !lowerCasedOption.includes(lowerCasedInputValue)
      ) {
        return false;
      }
      return true;
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
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLUListElement | null>(null);
  const toggleRef = useRef<HTMLSpanElement | null>(null);

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.code) {
      case "ArrowDown":
        e.preventDefault();
        if (highlightedItem !== null) {
          setHighlightedItem((highlightedItem + 1) % items.length);
        } else {
          setHighlightedItem(0);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
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
        e.preventDefault();
        if (highlightedItem !== null) {
          if (maxSelectedItems && selectedItems.length >= maxSelectedItems)
            return;
          setSelectedItems([...selectedItems, items[highlightedItem].name]);
          setOpen(false);
        }
        if (allowCreation && e.currentTarget.value.length > 0) {
          if (maxSelectedItems && selectedItems.length >= maxSelectedItems)
            return;
          setSelectedItems([...selectedItems, e.currentTarget.value]);
          setInputValue("");
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
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
      className="grid w-full gap-3"
      onFocus={() => {
        setActive(true);
        setOpen(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
    >
      <div className="flex flex-col">
        <Label title={name} active={active} />
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
        <div className={`relative `}>
          <div
            className={`flex w-full items-center justify-between border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 py-4 px-4`}
          >
            <input
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.currentTarget.value);
              }}
              onClick={() => {
                setOpen(true);
              }}
              value={inputValue}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                setOpen(true);
              }}
              className="placeholder:typo-body w-full bg-transparent placeholder:text-amber-200/50"
            />
            <span
              className={`cursor-pointer select-none transition-transform duration-300 ${
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
          {isOpen && items.length > 0 ? (
            <ComboboxMenu
              items={items.map((item) => item.name)}
              listItemClick={(item: string) => {
                if (
                  maxSelectedItems &&
                  selectedItems.length >= maxSelectedItems
                ) {
                  return;
                }
                setSelectedItems([...selectedItems, item]);
                setOpen(false);
              }}
              ref={ref}
            />
          ) : null}
        </div>
      </div>
      <SelectedItems
        items={options.filter((option) => selectedItems.includes(option.name))}
        onItemClick={(item) => {
          setSelectedItems(
            selectedItems.filter((selectedItem) => selectedItem !== item)
          );
        }}
      />

      {error && selectedItems.length !== maxSelectedItems && (
        <span className=" text-red-600">{error}</span>
      )}
    </div>
  );
}

function SelectedItems({
  items,
  onItemClick,
}: {
  items: Array<Option>;
  onItemClick: (item: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {items.map(({ name, abbr }, idx) => {
        return (
          <div
            key={`${name}${idx}`}
            className="relative flex h-16 w-16 cursor-pointer items-center justify-center gap-2 border border-amber-300 bg-slate-100/25 p-2 uppercase hover:bg-slate-100/50"
            onClick={() => {
              onItemClick(name);
            }}
          >
            <span className="typo-abbr text-slate-200">{abbr}</span>
          </div>
        );
      })}
    </div>
  );
}
