<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DestinationFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->city();

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 99999),
            'country' => fake()->country(),
            'region' => fake()->randomElement(['Asia', 'Europe', 'Americas', 'Africa']),
            'description' => fake()->paragraph(),
            'cover_image' => null,
            'is_featured' => false,
        ];
    }
}
