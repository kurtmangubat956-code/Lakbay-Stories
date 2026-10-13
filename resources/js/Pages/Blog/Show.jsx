import Article from '@/Components/Article';
import PostCard from '@/Components/PostCard';
import SectionHeading from '@/Components/SectionHeading';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Show({ post, related }) {
    const backLink = (
        <Link
            href={route('blog.index')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900"
        >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to stories
        </Link>
    );

    return (
        <SiteLayout>
            <Head title={post.title}>
                <meta name="description" content={post.excerpt} />
            </Head>

            <div className="container-page py-10">
                {backLink}
                <div className="mt-8">
                    <Article post={post} />
                </div>
                <div className="mx-auto mt-12 max-w-2xl border-t border-cream-300 pt-8">{backLink}</div>
            </div>

            {related.length > 0 && (
                <section className="container-page pt-16">
                    <SectionHeading eyebrow="Keep reading" title="Related stories" />
                    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((item) => (
                            <PostCard key={item.id} post={item} />
                        ))}
                    </div>
                </section>
            )}
        </SiteLayout>
    );
}
