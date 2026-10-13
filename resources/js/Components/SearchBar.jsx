import { Search, X } from 'lucide-react';

export default function SearchBar({ id, label, value, onChange, placeholder }) {
    return (
        <div className="relative w-full sm:max-w-xs">
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
                aria-hidden="true"
            />
            <input
                id={id}
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="field rounded-full py-2.5 pl-11 pr-10 text-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/50 hover:text-ink"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
