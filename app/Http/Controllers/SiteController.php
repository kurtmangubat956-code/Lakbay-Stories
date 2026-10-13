<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function home(): Response
    {
        $publishedCount = fn ($q) => $q->published();

        return Inertia::render('Home', [
            'featuredDestinations' => Destination::query()
                ->withCount(['posts as published_posts_count' => $publishedCount])
                ->orderByDesc('is_featured')
                ->orderBy('name')
                ->limit(4)
                ->get()
                ->map->toCard(),
            'latestPosts' => Post::published()
                ->with(['user', 'category', 'destination'])
                ->latest('published_at')
                ->limit(6)
                ->get()
                ->map->toCard(),
            'categories' => Category::query()
                ->withCount(['posts as published_posts_count' => $publishedCount])
                ->orderByDesc('published_posts_count')
                ->orderBy('name')
                ->limit(6)
                ->get(['id', 'name', 'slug', 'description']),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About', [
            'contactEmail' => config('site.contact_email'),
            'stats' => [
                'stories' => Post::published()->count(),
                'destinations' => Destination::count(),
                'countries' => Destination::distinct()->count('country'),
            ],
        ]);
    }

    public function credits(): Response
    {
        return Inertia::render('Credits', [
            'credits' => collect(config('site.credits'))->map(fn (array $credit) => [
                ...$credit,
                'preview' => asset("images/seed/{$credit['file']}"),
            ]),
        ]);
    }
}
