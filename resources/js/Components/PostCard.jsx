import CategoryBadge from '@/Components/CategoryBadge';
import SmartImage from '@/Components/SmartImage';
import { formatDate } from '@/lib/format';
import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export default function PostCard({ post }) {
    const href = route('blog.show', post.slug);

    return (
        <article className="group flex flex-col">
            <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
                <SmartImage
                    src={post.cover_image_url}
                    alt=""
                    className="aspect-[4/3] rounded-2xl"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink/60">
                <CategoryBadge category={post.category} />
                {post.destination && (
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.destination.name}, {post.destination.country}
                    </span>
                )}
            </div>

            <h3 className="mt-3 font-serif text-2xl leading-snug text-ink">
                <Link href={href} className="transition-colors hover:text-forest-700">
                    {post.title}
                </Link>
            </h3>

            <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/70">{post.excerpt}</p>

            <p className="mt-4 text-sm text-ink/60">
                By <span className="font-medium text-ink/80">{post.author}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span aria-hidden="true"> · </span>
                {post.reading_minutes} min read
            </p>
        </article>
    );
}
