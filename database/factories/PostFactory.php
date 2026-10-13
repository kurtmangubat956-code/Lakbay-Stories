<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = rtrim(fake()->unique()->sentence(5), '.');

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'destination_id' => Destination::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->text(160),
            'content' => fake()->paragraphs(5, true),
            'cover_image' => null,
            'status' => Post::PUBLISHED,
            'published_at' => now()->subDay(),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => Post::DRAFT, 'published_at' => null]);
    }
}
