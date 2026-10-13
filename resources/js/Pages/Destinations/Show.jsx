import DestinationCard from '@/Components/DestinationCard';
import EmptyState from '@/Components/EmptyState';
import HeroSection from '@/Components/HeroSection';
import PostCard from '@/Components/PostCard';
import SectionHeading from '@/Components/SectionHeading';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, PenLine } from 'lucide-react';

export default function Show({ destination, posts, nearby }) {
    return (
        <SiteLayout overlayNav>
            <Head title={`${destination.name}, ${destination.country}`} />

            <HeroSection
                size="md"
                image={destination.cover_image_url}
                alt={`${destination.name}, ${destination.country}`}
                eyebrow={[destination.region, destination.country].filter(Boolean).join(' · ')}
                title={destination.name}
            />

            <div className="container-page pt-10">
                <Link
                    href={route('destinations.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    All destinations
                </Link>

                <div className="mt-8 max-w-2xl space-y-6 text-lg leading-8 text-ink/80">
                    {destination.description.split(/\r?\n\s*\r?\n/).map((paragraph, index) => (
                        <p key={index} className={index === 0 ? 'font-serif text-2xl leading-9 text-ink' : ''}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <section className="container-page pt-20">
                <SectionHeading
                    eyebrow="Stories"
                    title={`Written in ${destination.name}`}
                    href={posts.length > 0 ? route('blog.index', { destination: destination.slug }) : undefined}
                    linkLabel="See all"
                />
                {posts.length > 0 ? (
                    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={PenLine}
                        title="No stories from here yet"
                        message={`Have you been to ${destination.name}? Yours could be the first.`}
                    >
                        <Link href={route('my-posts.create')} className="btn-primary">
                            Write a story
                        </Link>
                    </EmptyState>
                )}
            </section>

            {nearby.length > 0 && (
                <section className="container-page pt-24">
                    <SectionHeading eyebrow="Keep exploring" title="More destinations" />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {nearby.map((item) => (
                            <DestinationCard key={item.id} destination={item} />
                        ))}
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}
