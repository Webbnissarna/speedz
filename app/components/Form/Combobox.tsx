import { useState } from "react";

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

  return (
    <div>
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
        className="flex flex-col"
      >
        {selectedItem.length > 0 ? (
          <input readOnly hidden name={name} value={selectedItem} />
        ) : null}
        <span>{selectedItem.length > 0 ? selectedItem : null}</span>
        <div>
          <input
            type="text"
            onChange={(e) => {
              setTextInput(e.currentTarget.value);
            }}
            placeholder={defaultText}
          />
          <span>{isOpen ? "☝️" : "👇"}</span>
        </div>
      </div>
      {isOpen ? (
        <ul>
          {options
            .filter((option) => {
              const filtered = option.toLowerCase().includes(textInput);
              return filtered;
            })
            .map((option, idx) => {
              return (
                <li
                  key={`${option}${idx}`}
                  className="cursor-pointer"
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
