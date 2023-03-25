export default function Label({
  title,
  active,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 pb-6">
      <span className={`text-2xl ${active && "animate-nudgeRight"}`}>👉</span>
      <label
        htmlFor={title}
        className={"typo-h3 relative min-w-min overflow-x-hidden capitalize"}
      >
        {title}
        {active && (
          <div className="absolute top-0 bottom-0 left-0 right-0 animate-translate bg-amber-100/25" />
        )}
      </label>
      <span className={`text-2xl ${active && "animate-nudgeLeft"}`}>👈</span>
    </div>
  );
}
