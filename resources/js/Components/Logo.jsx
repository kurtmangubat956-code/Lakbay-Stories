import { Compass } from 'lucide-react';

export default function Logo({ className = '' }) {
    return (
        <span className={`inline-flex items-center gap-2 font-serif text-xl font-semibold tracking-tight ${className}`}>
            <Compass className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
            Beyond the Map
        </span>
    );
}
