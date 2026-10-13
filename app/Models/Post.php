<?php

namespace App\Models;

use App\Models\Concerns\HasCoverImage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasCoverImage, HasFactory;

    public const DRAFT = 'draft';

    public const PUBLISHED = 'published';

    protected $fillable = [
        'category_id',
        'destination_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function isPublished(): bool
    {
        return $this->status === self::PUBLISHED
            && $this->published_at !== null
            && $this->published_at->lte(now());
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', self::PUBLISHED)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, function (Builder $q, string $term) {
                $like = '%'.addcslashes($term, '%_\\').'%';
                $q->where(fn (Builder $w) => $w
                    ->where('title', 'like', $like)
                    ->orWhere('excerpt', 'like', $like)
                    ->orWhere('content', 'like', $like));
            })
            ->when($filters['category'] ?? null, fn (Builder $q, string $slug) => $q
                ->whereHas('category', fn (Builder $c) => $c->where('slug', $slug)))
            ->when($filters['destination'] ?? null, fn (Builder $q, string $slug) => $q
                ->whereHas('destination', fn (Builder $d) => $d->where('slug', $slug)));
    }

    public static function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'story';
        $base = Str::limit($base, 200, '');
        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    public function readingMinutes(): int
    {
        return max(1, (int) ceil(str_word_count($this->content) / 220));
    }

    public function toCard(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'cover_image_url' => $this->coverImageUrl(),
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'reading_minutes' => $this->readingMinutes(),
            'author' => $this->user?->name,
            'category' => $this->category?->only('id', 'name', 'slug'),
            'destination' => $this->destination?->only('id', 'name', 'slug', 'country'),
        ];
    }

    public function toArticle(): array
    {
        return [...$this->toCard(), 'content' => $this->content];
    }
}
