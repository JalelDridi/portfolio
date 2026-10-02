export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border bg-muted/60 px-3 py-1 text-sm font-medium text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
