export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className="border border-border px-2.5 py-1 font-mono text-[0.85rem] text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
