import { Star } from "lucide-react";

export default function StarRating({ value, onChange, readOnly = false, size = "h-5 w-5" }) {
  const stars = [1, 2, 3, 4, 5];

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5" aria-label={`${value} sur 5 étoiles`}>
        {stars.map((n) => (
          <Star
            key={n}
            className={`${size} ${n <= value ? "fill-green-400 text-green-400" : "fill-transparent text-gray-300 dark:text-white/20"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Note en étoiles" className="flex items-center gap-1">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded p-0.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          <Star
            className={`h-7 w-7 transition ${n <= value ? "fill-green-400 text-green-400" : "fill-transparent text-gray-300 hover:text-green-400/60 dark:text-white/20"}`}
          />
        </button>
      ))}
    </div>
  );
}