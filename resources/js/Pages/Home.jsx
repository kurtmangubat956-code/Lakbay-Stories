import DestinationCard from '@/Components/DestinationCard';
import EmptyState from '@/Components/EmptyState';
import HeroSection from '@/Components/HeroSection';
import PostCard from '@/Components/PostCard';
import SectionHeading from '@/Components/SectionHeading';
import SiteLayout from '@/Layouts/SiteLayout';
import { pluralize } from '@/lib/format';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Backpack, Landmark, Lightbulb, Mountain, Palmtree, Tag, UtensilsCrossed } from 'lucide-react';

const categoryIcons = {
    adventure: Mountain,
    'island-life': Palmtree,
    'culture-heritage': Landmark,
    'food-markets': UtensilsCrossed,
    'slow-travel': Backpack,
    'travel-tips': Lightbulb,
};

export default function Home({ featuredDestinations, latestPosts, categories }) {
    const { site } = usePage().props;

    return (
        <SiteLayout overlayNav flush>
            <Head title="Travel stories from the far side of familiar" />

            <HeroSection
                image={`${site.images}/kanlaon-volcano.jpg`}
                alt="Aerial view of Mount Kanlaon rising above farms and fields on Negros Island"
                eyebrow={site.name}
                title={site.tagline}
                description="Honest travel stories from the Negros Island Region: sugar country, quiet coasts, crater lakes, and the island of Siquijor."
                credit="Photo: Bien02 / Wikimedia Commons, CC BY 4.0"
            >
                <Link href={route('blog.index')} className="btn-light px-6 py-3 text-base">
                    Explore Stories
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                    href={route('destinations.index')}
                    className="btn border border-white/50 px-6 py-3 text-base text-white hover:bg-white/10"
                >
                    Browse destinations
                </Link>
            </HeroSection>

            <section className="container-page pt-20">
                <SectionHeading
                    eyebrow="Featured destinations"
                    title="Around Negros and Siquijor"
                    description="Beaches, heritage towns, reefs, and a volcano we keep going back to."
                    href={route('destinations.index')}
                    linkLabel="All destinations"
                />
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                    {featuredDestinations.map((destination) => (
                        <DestinationCard key={destination.id} destination={destination} tall />
                    ))}
                </div>
            </section>

            <section className="container-page pt-24">
                <SectionHeading
                    eyebrow="Latest stories"
                    title="Fresh from the road"
                    href={route('blog.index')}
                    linkLabel="All stories"
                />
                {latestPosts.length > 0 ? (
                    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {latestPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <EmptyState title="No stories yet" message="The first story is still being written. Check back soon." />
                )}
            </section>

            <section className="mt-24 bg-cream-200/60 pb-24 pt-20">
                <div className="container-page">
                    <SectionHeading
                        eyebrow="Popular categories"
                        title="Travel the way you like"
                        description="Pick a thread and follow it."
                    />
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const Icon = categoryIcons[category.slug] ?? Tag;

                            return (
                                <li key={category.id}>
                                    <Link
                                        href={route('blog.index', { category: category.slug })}
                                        className="group flex h-full gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 transition-colors duration-200 hover:border-forest-400"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700 transition-colors group-hover:bg-forest-700 group-hover:text-cream-50">
                                            <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
                                        </span>
                                        <span>
                                            <span className="block font-serif text-xl text-ink">{category.name}</span>
                                            <span className="mt-1 block text-sm leading-relaxed text-ink/70">
                                                {category.description}
                                            </span>
                                            <span className="mt-3 block text-xs font-semibold uppercase tracking-wider text-forest-600">
                                                {pluralize(category.published_posts_count, 'story', 'stories')}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        </SiteLayout>
    );
}
