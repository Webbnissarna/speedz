export default function Label({
  title,
  active,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 pb-6">
      <span className="text-2xl">👉</span>
      <label htmlFor={title} className="typo-h3 capitalize">
        {title}
      </label>
      <span className="text-2xl">👈</span>
    </div>
  );
}
