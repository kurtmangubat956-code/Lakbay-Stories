import PostForm from '@/Components/PostForm';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

export default function Edit({ post, categories, destinations, maxUploadKb }) {
    return (
        <SiteLayout>
            <Head title={`Edit: ${post.title}`} />

            <div className="container-page max-w-3xl py-12">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow">My travel journal</p>
                        <h1 className="mt-2 font-serif text-4xl text-ink">Edit story</h1>
                    </div>
                    <Link href={route('my-posts.show', post.id)} className="btn-secondary">
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Preview
                    </Link>
                </div>

                <div className="mt-10">
                    <PostForm
                        key={post.id}
                        post={post}
                        categories={categories}
                        destinations={destinations}
                        maxUploadKb={maxUploadKb}
                    />
                </div>
            </div>
        </SiteLayout>
    );
}
