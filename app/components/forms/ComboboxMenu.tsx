import React from "react";

type Props = {
  listItemClick: (item: string) => void;
  items: Array<string>;
};

const ComboboxMenu = React.forwardRef<HTMLUListElement, Props>(function Menu(
  { items, listItemClick },
  ref
) {
  return (
    <ul
      ref={ref}
      className="bg-gradient absolute top-[64px] left-0 right-0 z-10 flex max-h-36 flex-col gap-2 overflow-y-scroll rounded-lg border border-amber-200"
    >
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => {
            listItemClick(item);
            console.log("item clicked: ", item);
          }}
          className="cursor-pointer p-2 hover:bg-amber-300/25"
        >
          {item}
        </li>
      ))}
    </ul>
  );
});

export default ComboboxMenu;
