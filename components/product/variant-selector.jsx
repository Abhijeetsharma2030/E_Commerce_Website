import { cn } from "@/lib/utils";

export function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-900">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
              selected === size
                ? "border-blue-950 bg-blue-950 text-white"
                : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
            )}
            aria-pressed={selected === size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColorSelector({ colors, selected, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-900">
        Color{selected ? ` — ${selected.name}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onSelect(color)}
            className={cn(
              "h-9 w-9 rounded-full border-2 transition-transform",
              selected?.name === color.name
                ? "border-neutral-900 scale-110"
                : "border-transparent"
            )}
            style={{ backgroundColor: color.hex }}
            aria-pressed={selected?.name === color.name}
            aria-label={color.name}
          >
            <span
              className="block h-full w-full rounded-full ring-1 ring-inset ring-black/10"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
