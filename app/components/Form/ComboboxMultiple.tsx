import { useMemo, useState } from "react";

export default function MultipleComboBox({
  options,
  defaultText,
  name,
  placeholder,
  error,
}: {
  options: Array<string>;
  defaultText: string;
  name: string;
  placeholder: string;
  error: string | null | undefined;
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
  const items = useMemo(
    () => getFilteredOptions(selectedItems, inputValue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItems, inputValue]
  );

  return (
    <div>
      <div>
        <label>{defaultText}</label>
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
          <div>
            <input
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.currentTarget.value);
              }}
              value={inputValue}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();

                  if (e.currentTarget.value.length > 0) {
                    setSelectedItems([...selectedItems, e.currentTarget.value]);
                    setInputValue("");
                  }
                }
              }}
              onFocus={() => {
                setOpen(true);
              }}
            />
            <button type="button" onClick={() => setOpen(!isOpen)}>
              {isOpen ? "☝️" : "👇"}
            </button>
          </div>
        </div>
      </div>
      <ul>
        {isOpen &&
          items.map((option, idx) => {
            return (
              <li
                className="cursor-pointer hover:bg-slate-600"
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
      {error && <span className="font-bold text-red-600">{error}</span>}
    </div>
  );
}
