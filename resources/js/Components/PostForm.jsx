import ErrorMessage from '@/Components/ErrorMessage';
import ImageUploader from '@/Components/ImageUploader';
import InputError from '@/Components/InputError';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

function Field({ id, label, hint, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-ink/80">
                {label}
            </label>
            <div className="mt-2">{children}</div>
            {hint && (
                <p id={`${id}-hint`} className="mt-2 text-xs text-ink/60">
                    {hint}
                </p>
            )}
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export default function PostForm({ post, categories, destinations, maxUploadKb }) {
    const editing = Boolean(post);
    const submitStatus = useRef(post?.status ?? 'draft');

    const form = useForm({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        category_id: post?.category_id ?? '',
        destination_id: post?.destination_id ?? '',
        cover_image: null,
        remove_cover_image: false,
        status: post?.status ?? 'draft',
    });

    const { data, setData, errors, processing } = form;

    const submit = (status) => (e) => {
        e.preventDefault();
        submitStatus.current = status;

        form.transform((values) => ({
            ...values,
            status,
            remove_cover_image: values.remove_cover_image ? 1 : 0,
            ...(editing ? { _method: 'put' } : {}),
        }));

        form.post(editing ? route('my-posts.update', post.id) : route('my-posts.store'), {
            forceFormData: true,
            preserveScroll: (page) => Object.keys(page.props.errors).length > 0,
            onError: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        });
    };

    const busy = (status) => processing && submitStatus.current === status;
    const wasPublished = post?.status === 'published';

    return (
        <form onSubmit={submit('draft')} noValidate className="space-y-8">
            <ErrorMessage errors={errors} />

            <Field id="title" label="Title" error={errors.title}>
                <input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    maxLength={150}
                    required
                    aria-invalid={Boolean(errors.title)}
                    className="field font-serif text-2xl"
                    placeholder="Give your story a name"
                />
            </Field>

            <Field
                id="slug"
                label="URL slug"
                error={errors.slug}
                hint={
                    editing
                        ? 'Lowercase letters, numbers, and hyphens. Changing it changes the public link.'
                        : 'Optional. Leave blank to create one from the title.'
                }
            >
                <div className="flex items-center rounded-lg border border-cream-300 bg-white shadow-sm focus-within:border-forest-600 focus-within:ring-1 focus-within:ring-forest-600">
                    <span className="pl-3 text-sm text-ink/50">/blog/</span>
                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value.toLowerCase())}
                        maxLength={200}
                        aria-describedby="slug-hint"
                        aria-invalid={Boolean(errors.slug)}
                        className="w-full border-0 bg-transparent py-2 pl-1 text-sm focus:ring-0"
                        placeholder="my-story-title"
                    />
                </div>
            </Field>

            <Field
                id="excerpt"
                label="Excerpt"
                error={errors.excerpt}
                hint={`A one or two sentence summary shown on story cards. ${data.excerpt.length}/300`}
            >
                <textarea
                    id="excerpt"
                    rows={3}
                    value={data.excerpt}
                    onChange={(e) => setData('excerpt', e.target.value)}
                    maxLength={300}
                    required
                    aria-describedby="excerpt-hint"
                    aria-invalid={Boolean(errors.excerpt)}
                    className="field"
                />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
                <Field id="destination_id" label="Destination" error={errors.destination_id}>
                    <select
                        id="destination_id"
                        value={data.destination_id}
                        onChange={(e) => setData('destination_id', e.target.value)}
                        required
                        aria-invalid={Boolean(errors.destination_id)}
                        className="field"
                    >
                        <option value="">Choose a destination</option>
                        {destinations.map((destination) => (
                            <option key={destination.id} value={destination.id}>
                                {destination.name}, {destination.country}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field id="category_id" label="Category" error={errors.category_id}>
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        required
                        aria-invalid={Boolean(errors.category_id)}
                        className="field"
                    >
                        <option value="">Choose a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <ImageUploader
                id="cover_image"
                label="Cover image"
                currentUrl={post?.cover_image_url}
                maxKb={maxUploadKb}
                error={errors.cover_image}
                onChange={(file) => setData((values) => ({ ...values, cover_image: file, remove_cover_image: false }))}
                onRemove={() => setData((values) => ({ ...values, cover_image: null, remove_cover_image: true }))}
            />

            <Field
                id="content"
                label="Story"
                error={errors.content}
                hint="Leave a blank line between paragraphs. Start a line with ## to add a subheading."
            >
                <textarea
                    id="content"
                    rows={18}
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    required
                    aria-describedby="content-hint"
                    aria-invalid={Boolean(errors.content)}
                    className="field leading-7"
                />
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t border-cream-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link href={route('my-posts.index')} className="btn-secondary">
                    Cancel
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="submit" disabled={processing} className="btn-secondary">
                        {busy('draft') && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        {wasPublished ? 'Unpublish and save as draft' : 'Save draft'}
                    </button>
                    <button type="button" onClick={submit('published')} disabled={processing} className="btn-primary">
                        {busy('published') && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                        {wasPublished ? 'Save changes' : 'Publish'}
                    </button>
                </div>
            </div>
        </form>
    );
}
