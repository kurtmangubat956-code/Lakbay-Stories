<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasCoverImage
{
    public function coverImageUrl(): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        if (Str::startsWith($this->cover_image, ['http://', 'https://'])) {
            return $this->cover_image;
        }

        return $this->hasUploadedCover()
            ? asset('storage/'.$this->cover_image)
            : asset(ltrim($this->cover_image, '/'));
    }

    public function hasUploadedCover(): bool
    {
        return $this->cover_image
            && ! Str::startsWith($this->cover_image, ['/', 'http://', 'https://']);
    }
}
