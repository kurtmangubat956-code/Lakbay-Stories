import { Compass } from 'lucide-react';

export default function EmptyState({ title, message, icon: Icon = Compass, children }) {
    return (
        <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50 px-6 py-16 text-center">
            <Icon className="mx-auto h-10 w-10 text-forest-500" aria-hidden="true" strokeWidth={1.25} />
            <h2 className="mt-4 font-serif text-2xl text-ink">{title}</h2>
            {message && <p className="mx-auto mt-2 max-w-md text-ink/70">{message}</p>}
            {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
    );
}
