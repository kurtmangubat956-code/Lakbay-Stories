import SmartImage from '@/Components/SmartImage';
import { pluralize } from '@/lib/format';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function DestinationCard({ destination, tall = false }) {
    return (
        <Link
            href={route('destinations.show', destination.slug)}
            className="group relative block overflow-hidden rounded-2xl"
        >
            <SmartImage
                src={destination.cover_image_url}
                alt={`${destination.name}, ${destination.country}`}
                className={tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}
                imgClassName="transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-200">
                    {destination.region ?? destination.country}
                </p>
                <div className="mt-1 flex items-end justify-between gap-3">
                    <h3 className="font-serif text-2xl">{destination.name}</h3>
                    <ArrowUpRight
                        className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                    />
                </div>
                {!tall && <p className="mt-2 line-clamp-2 text-sm text-cream-100/90">{destination.summary}</p>}
                {destination.stories_count > 0 && (
                    <p className="mt-2 text-xs text-cream-200">
                        {pluralize(destination.stories_count, 'story', 'stories')}
                    </p>
                )}
            </div>
        </Link>
    );
}
