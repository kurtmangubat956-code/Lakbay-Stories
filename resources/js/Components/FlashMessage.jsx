import { usePage } from '@inertiajs/react';
import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!flash?.success) {
            return;
        }

        setMessage(flash.success);
        const timer = setTimeout(() => setMessage(null), 5000);

        return () => clearTimeout(timer);
    }, [flash]);

    return (
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
            {message && (
                <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-forest-800 py-3 pl-5 pr-3 text-sm font-medium text-cream-50 shadow-lg">
                    <CheckCircle2 className="h-5 w-5 text-forest-200" aria-hidden="true" />
                    {message}
                    <button
                        type="button"
                        onClick={() => setMessage(null)}
                        aria-label="Dismiss message"
                        className="rounded-full p-1 hover:bg-forest-700"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}
