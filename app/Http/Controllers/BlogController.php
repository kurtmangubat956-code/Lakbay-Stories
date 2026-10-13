<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'destination' => ['nullable', 'string', 'max:100'],
        ]);

        $posts = Post::published()
            ->with(['user', 'category', 'destination'])
            ->filter($filters)
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Post $post) => $post->toCard());

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'filters' => $filters,
            'categories' => Category::orderBy('name')->get(['name', 'slug']),
            'destinations' => Destination::orderBy('name')->get(['name', 'slug']),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->isPublished(), 404);

        $post->load(['user', 'category', 'destination']);

        $related = Post::published()
            ->with(['user', 'category', 'destination'])
            ->whereKeyNot($post->id)
            ->where(fn ($q) => $q
                ->where('destination_id', $post->destination_id)
                ->orWhere('category_id', $post->category_id))
            ->orderByRaw('destination_id = ? desc', [$post->destination_id])
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map->toCard();

        return Inertia::render('Blog/Show', [
            'post' => $post->toArticle(),
            'related' => $related,
        ]);
    }
}
