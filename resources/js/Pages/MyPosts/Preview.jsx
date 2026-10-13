import Article from '@/Components/Article';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';

export default function Preview({ post }) {
    const published = post.status === 'published';

    return (
        <SiteLayout>
            <Head title={`Preview: ${post.title}`} />

            <div className="border-b border-cream-300 bg-cream-200/70">
                <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                    <p className="text-ink/80">
                        <span className="font-semibold">Preview.</span>{' '}
                        {published ? 'This story is live.' : 'This draft is only visible to you.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={route('my-posts.index')} className="btn-secondary py-2">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            My journal
                        </Link>
                        <Link href={route('my-posts.edit', post.id)} className="btn-secondary py-2">
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Edit
                        </Link>
                        {published && (
                            <Link href={route('blog.show', post.slug)} className="btn-primary py-2">
                                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                View live
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container-page py-12">
                <Article post={post} />
            </div>
        </SiteLayout>
    );
}
