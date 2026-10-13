<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function view(?User $user, Post $post): bool
    {
        return $post->isPublished() || $user?->id === $post->user_id;
    }

    public function manage(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function update(User $user, Post $post): bool
    {
        return $this->manage($user, $post);
    }

    public function delete(User $user, Post $post): bool
    {
        return $this->manage($user, $post);
    }
}
