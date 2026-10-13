<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'email_verified_at'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'site' => [
                'name' => config('site.name'),
                'tagline' => config('site.tagline'),
                'images' => asset('images/seed'),
            ],
        ];
    }
}
