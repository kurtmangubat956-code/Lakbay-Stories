import { Mountain } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SmartImage({ src, alt, className = '', imgClassName = '', eager = false }) {
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false), [src]);

    return (
        <div className={`relative overflow-hidden bg-forest-100 ${className}`}>
            {src && !failed ? (
                <img
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => setFailed(true)}
                    className={`h-full w-full object-cover ${imgClassName}`}
                />
            ) : (
                <div
                    role={alt ? 'img' : undefined}
                    aria-label={alt || undefined}
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-200 to-forest-100 text-forest-600"
                >
                    <Mountain className="h-10 w-10" aria-hidden="true" strokeWidth={1.25} />
                </div>
            )}
        </div>
    );
}
