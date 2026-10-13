import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ eyebrow, title, description, href, linkLabel }) {
    return (
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h2 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
                {description && <p className="mt-3 text-ink/70">{description}</p>}
            </div>
            {href && (
                <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900"
                >
                    {linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
            )}
        </div>
    );
}
