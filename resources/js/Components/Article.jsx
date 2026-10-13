import ArticleBody from '@/Components/ArticleBody';
import CategoryBadge from '@/Components/CategoryBadge';
import SmartImage from '@/Components/SmartImage';
import { formatDate } from '@/lib/format';
import { Link } from '@inertiajs/react';
import { CalendarDays, Clock, MapPin, UserRound } from 'lucide-react';

export default function Article({ post }) {
    return (
        <article>
            <header className="mx-auto max-w-3xl text-center">
                <CategoryBadge category={post.category} />
                <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">{post.title}</h1>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">{post.excerpt}</p>

                <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink/70">
                    <li className="inline-flex items-center gap-1.5">
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Author:</span>
                        {post.author}
                    </li>
                    {post.destination && (
                        <li className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Destination:</span>
                            <Link
                                href={route('destinations.show', post.destination.slug)}
                                className="underline-offset-4 hover:text-forest-800 hover:underline"
                            >
                                {post.destination.name}, {post.destination.country}
                            </Link>
                        </li>
                    )}
                    <li className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" aria-hidden="true" />
                        {post.published_at ? (
                            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        ) : (
                            'Not published'
                        )}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {post.reading_minutes} min read
                    </li>
                </ul>
            </header>

            <SmartImage
                src={post.cover_image_url}
                alt={`Cover photo for ${post.title}`}
                eager
                className="mx-auto mt-10 aspect-[16/9] max-w-5xl rounded-3xl"
            />

            <div className="mt-12">
                <ArticleBody content={post.content} />
            </div>
        </article>
    );
}
