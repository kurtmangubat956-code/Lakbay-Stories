<?php

namespace App\Models;

use App\Models\Concerns\HasCoverImage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Destination extends Model
{
    use HasCoverImage, HasFactory;

    protected $fillable = ['name', 'slug', 'country', 'region', 'description', 'cover_image', 'is_featured'];

    protected function casts(): array
    {
        return ['is_featured' => 'boolean'];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, function (Builder $q, string $term) {
                $like = '%'.addcslashes($term, '%_\\').'%';
                $q->where(fn (Builder $w) => $w->where('name', 'like', $like)->orWhere('country', 'like', $like));
            })
            ->when($filters['country'] ?? null, fn (Builder $q, string $country) => $q->where('country', $country))
            ->when($filters['region'] ?? null, fn (Builder $q, string $region) => $q->where('region', $region));
    }

    public function toCard(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'country' => $this->country,
            'region' => $this->region,
            'summary' => Str::limit($this->description, 150),
            'cover_image_url' => $this->coverImageUrl(),
            'stories_count' => $this->published_posts_count ?? null,
        ];
    }
}
