<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'region' => ['nullable', 'string', 'max:100'],
        ]);

        $destinations = Destination::query()
            ->withCount(['posts as published_posts_count' => fn ($q) => $q->published()])
            ->filter($filters)
            ->orderBy('country')
            ->orderBy('name')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Destination $destination) => $destination->toCard());

        return Inertia::render('Destinations/Index', [
            'destinations' => $destinations,
            'filters' => $filters,
            'countries' => Destination::distinct()->orderBy('country')->pluck('country'),
            'regions' => Destination::whereNotNull('region')->distinct()->orderBy('region')->pluck('region'),
        ]);
    }

    public function show(Destination $destination): Response
    {
        return Inertia::render('Destinations/Show', [
            'destination' => [
                ...$destination->toCard(),
                'description' => $destination->description,
            ],
            'posts' => $destination->posts()
                ->published()
                ->with(['user', 'category', 'destination'])
                ->latest('published_at')
                ->limit(6)
                ->get()
                ->map->toCard(),
            'nearby' => Destination::query()
                ->whereKeyNot($destination->id)
                ->orderByRaw('region = ? desc', [$destination->region])
                ->orderBy('name')
                ->limit(3)
                ->get()
                ->map->toCard(),
        ]);
    }
}
