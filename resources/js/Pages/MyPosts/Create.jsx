import PostForm from '@/Components/PostForm';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';

export default function Create({ categories, destinations, maxUploadKb }) {
    return (
        <SiteLayout>
            <Head title="New Story" />

            <div className="container-page max-w-3xl py-12">
                <p className="eyebrow">My travel journal</p>
                <h1 className="mt-2 font-serif text-4xl text-ink">Write a new story</h1>
                <p className="mt-3 text-ink/70">Save a draft whenever you like. Only published stories are public.</p>

                <div className="mt-10">
                    <PostForm categories={categories} destinations={destinations} maxUploadKb={maxUploadKb} />
                </div>
            </div>
        </SiteLayout>
    );
}
