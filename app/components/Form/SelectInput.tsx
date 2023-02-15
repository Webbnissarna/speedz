import { useState } from "react";

type SelectProps = {
  name: string;
  defaultText: string;
  error: string | null | undefined;
  options: Array<string>;
  setValue?: (values: Array<string>) => void;
};

export default function SelectInput({
  options,
  name,
  defaultText,
  error,
}: SelectProps) {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  return (
    <div>
      <div
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        {selectedItem.length > 0 ? (
          <input hidden name={name} readOnly value={selectedItem} />
        ) : null}
        <span>{selectedItem.length > 0 ? selectedItem : defaultText}</span>
        <span>{isOpen ? "☝️" : "👇"}</span>
      </div>
      <ul>
        {isOpen &&
          options.map((option, idx) => {
            return (
              <li
                key={`${option}${idx}`}
                value={option}
                onClick={() => {
                  setSelectedItem(option);
                  setOpen(false);
                }}
                className={`${option === selectedItem ? "font-bold" : ""}`}
              >
                {option}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
