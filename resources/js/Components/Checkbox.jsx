export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={`rounded border-cream-300 text-forest-700 shadow-sm focus:ring-forest-600 ${className}`}
        />
    );
}
