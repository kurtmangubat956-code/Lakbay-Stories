import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const base =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors';

function EdgeLink({ link, label, icon: Icon }) {
    return link.url ? (
        <Link href={link.url} aria-label={label} className={`${base} text-forest-800 hover:bg-forest-50`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
        </Link>
    ) : (
        <span aria-hidden="true" className={`${base} text-ink/25`}>
            <Icon className="h-4 w-4" />
        </span>
    );
}

export default function Pagination({ paginator }) {
    if (!paginator || paginator.last_page <= 1) {
        return null;
    }

    const { links } = paginator;

    return (
        <nav aria-label="Pagination" className="mt-14 flex flex-col items-center gap-3">
            <ul className="flex flex-wrap items-center justify-center gap-1">
                <li>
                    <EdgeLink link={links[0]} label="Previous page" icon={ChevronLeft} />
                </li>
                {links.slice(1, -1).map((link, index) => (
                    <li key={`${link.label}-${index}`}>
                        {link.url ? (
                            <Link
                                href={link.url}
                                aria-label={`Page ${link.label}`}
                                aria-current={link.active ? 'page' : undefined}
                                className={`${base} ${
                                    link.active ? 'bg-forest-700 text-cream-50' : 'text-forest-800 hover:bg-forest-50'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <span className={`${base} text-ink/40`}>…</span>
                        )}
                    </li>
                ))}
                <li>
                    <EdgeLink link={links[links.length - 1]} label="Next page" icon={ChevronRight} />
                </li>
            </ul>
            <p className="text-sm text-ink/60">
                Showing {paginator.from}–{paginator.to} of {paginator.total}
            </p>
        </nav>
    );
}
