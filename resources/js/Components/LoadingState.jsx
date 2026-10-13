import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading…', className = '' }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center gap-2 py-16 text-ink/60 ${className}`}
        >
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}
