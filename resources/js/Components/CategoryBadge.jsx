import { Link } from '@inertiajs/react';

export default function CategoryBadge({ category, linked = true, className = '' }) {
    if (!category) {
        return null;
    }

    const classes = `inline-block rounded-full bg-forest-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-700 ${className}`;

    return linked ? (
        <Link
            href={route('blog.index', { category: category.slug })}
            className={`${classes} transition-colors hover:bg-forest-100`}
        >
            {category.name}
        </Link>
    ) : (
        <span className={classes}>{category.name}</span>
    );
}
