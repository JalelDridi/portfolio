export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className="bg-sun px-2 py-0.5 font-mono text-[0.8rem] text-[#101922]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
