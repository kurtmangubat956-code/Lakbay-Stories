export function FilterSelect({ id, label, value, onChange, options, allLabel }) {
    return (
        <div className="w-full sm:w-auto">
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="field rounded-full py-2.5 pl-4 pr-10 text-sm sm:w-52"
            >
                <option value="">{allLabel}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default function FilterBar({ children, onReset, showReset }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {children}
            {showReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className="self-start rounded-full px-3 py-2 text-sm font-medium text-forest-700 underline-offset-4 hover:underline sm:self-auto"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}
