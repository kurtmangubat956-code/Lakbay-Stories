import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ title = 'Please fix the following', errors }) {
    const messages = Array.isArray(errors) ? errors : Object.values(errors ?? {});

    if (messages.length === 0) {
        return null;
    }

    return (
        <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
                <p className="font-semibold">{title}</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {messages.map((message) => (
                        <li key={message}>{message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
