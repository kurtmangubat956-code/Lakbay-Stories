import ConfirmDialog from '@/Components/ConfirmDialog';
import EmptyState from '@/Components/EmptyState';
import LoadingState from '@/Components/LoadingState';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import SmartImage from '@/Components/SmartImage';
import useFilters from '@/hooks/useFilters';
import SiteLayout from '@/Layouts/SiteLayout';
import { formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, NotebookPen, Pencil, Plus, Send, Trash2, Undo2 } from 'lucide-react';
import { useState } from 'react';

const tabs = [
    { value: '', label: 'All', count: 'all' },
    { value: 'published', label: 'Published', count: 'published' },
    { value: 'draft', label: 'Drafts', count: 'draft' },
];

const action =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50';

export default function Index({ posts, filters, counts }) {
    const { values, setFilter, reset, loading, isActive } = useFilters(
        route('my-posts.index'),
        { search: filters.search ?? '', status: filters.status ?? '' },
        ['posts', 'filters', 'counts'],
    );
    const [deleting, setDeleting] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const toggleStatus = (post) => {
        router.patch(
            route('my-posts.status', post.id),
            { status: post.status === 'published' ? 'draft' : 'published' },
            {
                preserveScroll: true,
                onStart: () => setBusyId(post.id),
                onFinish: () => setBusyId(null),
            },
        );
    };

    const confirmDelete = () => {
        router.delete(route('my-posts.destroy', deleting.id), {
            preserveScroll: true,
            onStart: () => setBusyId(deleting.id),
            onFinish: () => {
                setBusyId(null);
                setDeleting(null);
            },
        });
    };

    return (
        <SiteLayout>
            <Head title="My Travel Journal" />

            <div className="container-page max-w-5xl py-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow">Your stories</p>
                        <h1 className="mt-2 font-serif text-4xl text-ink">My Travel Journal</h1>
                    </div>
                    <Link href={route('my-posts.create')} className="btn-primary">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        New story
                    </Link>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 rounded-full bg-cream-200/70 p-1" role="group" aria-label="Filter by status">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                type="button"
                                aria-pressed={values.status === tab.value}
                                onClick={() => setFilter('status', tab.value)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    values.status === tab.value
                                        ? 'bg-cream-50 text-forest-800 shadow-sm'
                                        : 'text-ink/60 hover:text-ink'
                                }`}
                            >
                                {tab.label} <span className="text-ink/50">{counts[tab.count]}</span>
                            </button>
                        ))}
                    </div>
                    <SearchBar
                        id="my-post-search"
                        label="Search your stories"
                        placeholder="Search your stories"
                        value={values.search}
                        onChange={(value) => setFilter('search', value, { debounce: true })}
                    />
                </div>

                <div className="mt-6">
                    {loading ? (
                        <LoadingState label="Loading your stories…" />
                    ) : posts.data.length === 0 ? (
                        counts.all === 0 ? (
                            <EmptyState
                                icon={NotebookPen}
                                title="Your journal is empty"
                                message="Start with a draft. Nobody sees it until you publish."
                            >
                                <Link href={route('my-posts.create')} className="btn-primary">
                                    Write your first story
                                </Link>
                            </EmptyState>
                        ) : (
                            <EmptyState title="Nothing matches" message="Try a different search or status.">
                                {isActive && (
                                    <button type="button" onClick={reset} className="btn-secondary">
                                        Clear filters
                                    </button>
                                )}
                            </EmptyState>
                        )
                    ) : (
                        <ul className="divide-y divide-cream-300 rounded-2xl border border-cream-300 bg-cream-50">
                            {posts.data.map((post) => {
                                const published = post.status === 'published';
                                const busy = busyId === post.id;

                                return (
                                    <li key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                                        <SmartImage
                                            src={post.cover_image_url}
                                            alt=""
                                            className="aspect-[16/9] w-full shrink-0 rounded-xl sm:aspect-[4/3] sm:w-36"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                                                        published
                                                            ? 'bg-forest-100 text-forest-800'
                                                            : 'bg-cream-200 text-ink/70'
                                                    }`}
                                                >
                                                    {published ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-ink/60">
                                                    {post.category?.name} · {post.destination?.name}
                                                </span>
                                            </div>
                                            <h2 className="mt-2 truncate font-serif text-xl text-ink">
                                                <Link
                                                    href={route('my-posts.edit', post.id)}
                                                    className="hover:text-forest-700"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="mt-1 text-xs text-ink/60">
                                                {published
                                                    ? `Published ${formatDate(post.published_at)}`
                                                    : `Last edited ${formatDate(post.updated_at)}`}
                                            </p>

                                            <div className="-ml-3 mt-3 flex flex-wrap items-center gap-1">
                                                <Link
                                                    href={route('my-posts.show', post.id)}
                                                    className={`${action} text-forest-800 hover:bg-forest-50`}
                                                >
                                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                                    Preview
                                                    <span className="sr-only">{post.title}</span>
                                                </Link>
                                                <Link
                                                    href={route('my-posts.edit', post.id)}
                                                    className={`${action} text-forest-800 hover:bg-forest-50`}
                                                >
                                                    <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    Edit
                                                    <span className="sr-only">{post.title}</span>
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(post)}
                                                    disabled={busy}
                                                    className={`${action} text-forest-800 hover:bg-forest-50`}
                                                >
                                                    {published ? (
                                                        <Undo2 className="h-4 w-4" aria-hidden="true" />
                                                    ) : (
                                                        <Send className="h-4 w-4" aria-hidden="true" />
                                                    )}
                                                    {published ? 'Unpublish' : 'Publish'}
                                                    <span className="sr-only">{post.title}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleting(post)}
                                                    disabled={busy}
                                                    className={`${action} text-red-700 hover:bg-red-50`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    Delete
                                                    <span className="sr-only">{post.title}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {!loading && <Pagination paginator={posts} />}
            </div>

            <ConfirmDialog
                show={deleting !== null}
                title="Delete this story?"
                message={
                    deleting
                        ? `"${deleting.title}" and its cover image will be permanently removed. This cannot be undone.`
                        : ''
                }
                confirmLabel="Delete story"
                processing={busyId !== null && busyId === deleting?.id}
                onConfirm={confirmDelete}
                onClose={() => setDeleting(null)}
            />
        </SiteLayout>
    );
}
