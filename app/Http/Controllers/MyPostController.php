<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostRequest;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MyPostController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in([Post::DRAFT, Post::PUBLISHED])],
        ]);

        $posts = $request->user()->posts()
            ->with(['category', 'destination', 'user'])
            ->filter($filters)
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Post $post) => $post->toCard());

        return Inertia::render('MyPosts/Index', [
            'posts' => $posts,
            'filters' => $filters,
            'counts' => [
                'all' => $request->user()->posts()->count(),
                'published' => $request->user()->posts()->where('status', Post::PUBLISHED)->count(),
                'draft' => $request->user()->posts()->where('status', Post::DRAFT)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('MyPosts/Create', $this->formOptions());
    }

    public function store(PostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['cover_image', 'remove_cover_image']);
        $data['slug'] = Post::uniqueSlug($data['slug'] ?? $data['title']);
        $data['published_at'] = $data['status'] === Post::PUBLISHED ? now() : null;
        $data['cover_image'] = $request->file('cover_image')?->store('posts', 'public');

        try {
            $post = DB::transaction(fn () => $request->user()->posts()->create($data));
        } catch (Throwable $e) {
            if ($data['cover_image']) {
                Storage::disk('public')->delete($data['cover_image']);
            }

            throw $e;
        }

        return redirect()->route('my-posts.index')->with('success', $this->savedMessage($post));
    }

    public function show(Post $post): Response
    {
        Gate::authorize('manage', $post);

        return Inertia::render('MyPosts/Preview', [
            'post' => $post->load(['user', 'category', 'destination'])->toArticle(),
        ]);
    }

    public function edit(Post $post): Response
    {
        Gate::authorize('update', $post);

        return Inertia::render('MyPosts/Edit', [
            'post' => [
                ...$post->only('id', 'title', 'slug', 'excerpt', 'content', 'category_id', 'destination_id', 'status'),
                'cover_image_url' => $post->coverImageUrl(),
            ],
            ...$this->formOptions(),
        ]);
    }

    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->safe()->except(['cover_image', 'remove_cover_image']);
        $data['slug'] = Post::uniqueSlug($data['slug'] ?? $data['title'], $post->id);
        $data['published_at'] = $data['status'] === Post::PUBLISHED ? ($post->published_at ?? now()) : null;

        $oldCover = $post->hasUploadedCover() ? $post->cover_image : null;
        $newCover = $request->file('cover_image')?->store('posts', 'public');

        if ($newCover) {
            $data['cover_image'] = $newCover;
        } elseif ($request->boolean('remove_cover_image')) {
            $data['cover_image'] = null;
        }

        try {
            DB::transaction(fn () => $post->update($data));
        } catch (Throwable $e) {
            if ($newCover) {
                Storage::disk('public')->delete($newCover);
            }

            throw $e;
        }

        if ($oldCover && $oldCover !== $post->cover_image) {
            Storage::disk('public')->delete($oldCover);
        }

        return redirect()->route('my-posts.index')->with('success', $this->savedMessage($post));
    }

    public function updateStatus(Request $request, Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $status = $request->validate([
            'status' => ['required', Rule::in([Post::DRAFT, Post::PUBLISHED])],
        ])['status'];

        $post->update([
            'status' => $status,
            'published_at' => $status === Post::PUBLISHED ? ($post->published_at ?? now()) : null,
        ]);

        return back()->with('success', $this->savedMessage($post));
    }

    public function destroy(Post $post): RedirectResponse
    {
        Gate::authorize('delete', $post);

        $cover = $post->hasUploadedCover() ? $post->cover_image : null;

        $post->delete();

        if ($cover) {
            Storage::disk('public')->delete($cover);
        }

        return redirect()->route('my-posts.index')->with('success', 'Story deleted.');
    }

    private function formOptions(): array
    {
        return [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'destinations' => Destination::orderBy('name')->get(['id', 'name', 'country']),
            'maxUploadKb' => config('site.max_upload_kb'),
        ];
    }

    private function savedMessage(Post $post): string
    {
        return $post->status === Post::PUBLISHED ? 'Story published.' : 'Draft saved.';
    }
}
