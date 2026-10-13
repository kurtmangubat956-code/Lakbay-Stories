import EmptyState from '@/Components/EmptyState';
import FilterBar, { FilterSelect } from '@/Components/FilterBar';
import LoadingState from '@/Components/LoadingState';
import Pagination from '@/Components/Pagination';
import PostCard from '@/Components/PostCard';
import SearchBar from '@/Components/SearchBar';
import useFilters from '@/hooks/useFilters';
import SiteLayout from '@/Layouts/SiteLayout';
import { pluralize } from '@/lib/format';
import { Head } from '@inertiajs/react';

const toOptions = (items) => items.map((item) => ({ value: item.slug, label: item.name }));

export default function Index({ posts, filters, categories, destinations }) {
    const { values, setFilter, reset, loading, isActive } = useFilters(
        route('blog.index'),
        {
            search: filters.search ?? '',
            category: filters.category ?? '',
            destination: filters.destination ?? '',
        },
        ['posts', 'filters'],
    );

    return (
        <SiteLayout>
            <Head title="Travel Stories" />

            <div className="container-page py-14">
                <header className="max-w-2xl">
                    <p className="eyebrow">Travel stories</p>
                    <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                        Notes from the road
                    </h1>
                    <p className="mt-4 text-lg text-ink/70">
                        First-hand accounts, practical advice, and the small moments that make a trip.
                    </p>
                </header>

                <div className="mt-10">
                    <FilterBar onReset={reset} showReset={isActive}>
                        <SearchBar
                            id="story-search"
                            label="Search stories"
                            placeholder="Search stories"
                            value={values.search}
                            onChange={(value) => setFilter('search', value, { debounce: true })}
                        />
                        <FilterSelect
                            id="story-category"
                            label="Filter by category"
                            allLabel="All categories"
                            value={values.category}
                            onChange={(value) => setFilter('category', value)}
                            options={toOptions(categories)}
                        />
                        <FilterSelect
                            id="story-destination"
                            label="Filter by destination"
                            allLabel="All destinations"
                            value={values.destination}
                            onChange={(value) => setFilter('destination', value)}
                            options={toOptions(destinations)}
                        />
                    </FilterBar>
                </div>

                <p className="mt-8 text-sm text-ink/60" aria-live="polite">
                    {pluralize(posts.total, 'story', 'stories')}
                </p>

                <div className="mt-6">
                    {loading ? (
                        <LoadingState label="Finding stories…" />
                    ) : posts.data.length > 0 ? (
                        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No stories match"
                            message="Try another search term or remove a filter."
                        >
                            <button type="button" onClick={reset} className="btn-secondary">
                                Clear filters
                            </button>
                        </EmptyState>
                    )}
                </div>

                {!loading && <Pagination paginator={posts} />}
            </div>
        </SiteLayout>
    );
}
