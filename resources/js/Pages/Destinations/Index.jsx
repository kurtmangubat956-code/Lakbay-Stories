import DestinationCard from '@/Components/DestinationCard';
import EmptyState from '@/Components/EmptyState';
import FilterBar, { FilterSelect } from '@/Components/FilterBar';
import LoadingState from '@/Components/LoadingState';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import useFilters from '@/hooks/useFilters';
import SiteLayout from '@/Layouts/SiteLayout';
import { pluralize } from '@/lib/format';
import { Head } from '@inertiajs/react';

export default function Index({ destinations, filters, countries, regions }) {
    const { values, setFilter, reset, loading, isActive } = useFilters(
        route('destinations.index'),
        { search: filters.search ?? '', region: filters.region ?? '', country: filters.country ?? '' },
        ['destinations', 'filters'],
    );

    const chip = (active) =>
        `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active ? 'bg-forest-700 text-cream-50' : 'bg-cream-50 text-ink/70 ring-1 ring-cream-300 hover:text-forest-800'
        }`;

    return (
        <SiteLayout>
            <Head title="Destinations" />

            <div className="container-page py-14">
                <header className="max-w-2xl">
                    <p className="eyebrow">Destinations</p>
                    <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                        Places worth the long way round
                    </h1>
                    <p className="mt-4 text-lg text-ink/70">
                        Browse the Negros Island Region by province, then read the stories written there.
                    </p>
                </header>

                <div className="mt-10 space-y-4">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by province">
                        <button type="button" aria-pressed={!values.region} onClick={() => setFilter('region', '')} className={chip(!values.region)}>
                            All provinces
                        </button>
                        {regions.map((region) => (
                            <button
                                key={region}
                                type="button"
                                aria-pressed={values.region === region}
                                onClick={() => setFilter('region', region)}
                                className={chip(values.region === region)}
                            >
                                {region}
                            </button>
                        ))}
                    </div>

                    <FilterBar onReset={reset} showReset={isActive}>
                        <SearchBar
                            id="destination-search"
                            label="Search destinations by name"
                            placeholder="Search destinations"
                            value={values.search}
                            onChange={(value) => setFilter('search', value, { debounce: true })}
                        />
                        {countries.length > 1 && (
                            <FilterSelect
                                id="destination-country"
                                label="Filter by country"
                                allLabel="All countries"
                                value={values.country}
                                onChange={(value) => setFilter('country', value)}
                                options={countries.map((country) => ({ value: country, label: country }))}
                            />
                        )}
                    </FilterBar>
                </div>

                <p className="mt-8 text-sm text-ink/60" aria-live="polite">
                    {pluralize(destinations.total, 'destination')}
                </p>

                <div className="mt-4">
                    {loading ? (
                        <LoadingState label="Finding destinations…" />
                    ) : destinations.data.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {destinations.data.map((destination) => (
                                <DestinationCard key={destination.id} destination={destination} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No destinations match"
                            message="Try a different name or province."
                        >
                            <button type="button" onClick={reset} className="btn-secondary">
                                Clear filters
                            </button>
                        </EmptyState>
                    )}
                </div>

                {!loading && <Pagination paginator={destinations} />}
            </div>
        </SiteLayout>
    );
}
