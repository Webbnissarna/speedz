import { useMemo, useState } from "react";

type ComboboxProps = {
  options: Array<string>;
  defaultText: string;
  name: string;
};

export default function ComboboxInput({
  defaultText,
  options,
  name,
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

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        {selectedItem.length > 0 ? (
          <input readOnly hidden name={name} value={selectedItem} />
        ) : null}

        {selectedItem.length > 0 ? (
          <div className="cursor-default p-2">
            <span>👉</span>
            <span className="w-fit border border-amber-200 p-2">
              {selectedItem}
            </span>
            <span>👈</span>
          </div>
        ) : null}

        <div className="">
          <input
            type="text"
            onChange={(e) => {
              setTextInput(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
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
                      setHighlightedItem(
                        (highlightedItem - 1) % filtered.length
                      );
                    }
                  } else {
                    setHighlightedItem(filtered.length - 1);
                  }
                  break;
                case "Enter":
                  e.preventDefault();
                  if (highlightedItem !== null) {
                    setSelectedItem(filtered[highlightedItem]);
                  }
                  break;
                default:
                  break;
              }
            }}
            placeholder={defaultText}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setHighlightedItem(null);
              setOpen(false);
            }}
            className="border border-r-0 border-amber-200 bg-transparent px-2"
          />
          <span
            onClick={() => {
              setOpen(!isOpen);
            }}
            className="right-2 inline-block cursor-pointer border border-l-0 border-amber-200 pr-2"
          >
            {isOpen ? "☝️" : "👇"}
          </span>
        </div>
      </div>
      {isOpen ? (
        <ul>
          {filtered.map((option, idx) => {
            return (
              <li
                key={`${option}${idx}`}
                className={`cursor-pointer ${
                  idx === highlightedItem ? "bg-slate-600" : ""
                }`}
                onClick={() => {
                  setSelectedItem(option);
                }}
              >
                {option}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
