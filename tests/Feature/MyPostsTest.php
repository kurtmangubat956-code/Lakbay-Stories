<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MyPostsTest extends TestCase
{
    use RefreshDatabase;

    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    private function payload(array $overrides = []): array
    {
        return [
            'title' => 'Three days in the Cordillera',
            'slug' => '',
            'excerpt' => 'A short summary of a long walk through the mountains.',
            'content' => str_repeat('We walked along the terrace walls until the light went. ', 4),
            'category_id' => Category::factory()->create()->id,
            'destination_id' => Destination::factory()->create()->id,
            'status' => Post::DRAFT,
            ...$overrides,
        ];
    }

    private function image(string $name = 'cover.png'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, base64_decode(self::PNG));
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $post = Post::factory()->create();

        $this->get('/my-posts')->assertRedirect(route('login'));
        $this->get('/my-posts/create')->assertRedirect(route('login'));
        $this->post('/my-posts', $this->payload())->assertRedirect(route('login'));
        $this->put("/my-posts/{$post->id}", $this->payload())->assertRedirect(route('login'));
        $this->patch("/my-posts/{$post->id}/status", ['status' => Post::DRAFT])->assertRedirect(route('login'));
        $this->delete("/my-posts/{$post->id}")->assertRedirect(route('login'));

        $this->assertDatabaseCount('posts', 1);
    }

    public function test_index_lists_only_the_users_own_posts(): void
    {
        $user = User::factory()->create();
        Post::factory()->for($user)->create();
        Post::factory()->for($user)->draft()->create();
        Post::factory()->create();

        $this->actingAs($user)->get('/my-posts')->assertInertia(fn (Assert $page) => $page
            ->component('MyPosts/Index')
            ->where('posts.total', 2)
            ->where('counts.draft', 1));

        $this->actingAs($user)->get('/my-posts?status=draft')
            ->assertInertia(fn (Assert $page) => $page->where('posts.total', 1));
    }

    public function test_user_can_save_a_draft_with_a_generated_slug(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/my-posts', $this->payload())
            ->assertRedirect(route('my-posts.index'))
            ->assertSessionHas('success', 'Draft saved.');

        $post = Post::sole();
        $this->assertSame($user->id, $post->user_id);
        $this->assertSame('three-days-in-the-cordillera', $post->slug);
        $this->assertSame(Post::DRAFT, $post->status);
        $this->assertNull($post->published_at);
        $this->get("/blog/{$post->slug}")->assertNotFound();
    }

    public function test_user_can_publish_with_an_uploaded_cover_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/my-posts', $this->payload(['status' => Post::PUBLISHED, 'cover_image' => $this->image()]))
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success', 'Story published.');

        $post = Post::sole();
        $this->assertNotNull($post->published_at);
        Storage::disk('public')->assertExists($post->cover_image);
        $this->get("/blog/{$post->slug}")->assertOk();
    }

    public function test_duplicate_titles_get_unique_slugs(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/my-posts', $this->payload());
        $this->actingAs($user)->post('/my-posts', $this->payload());

        $this->assertEqualsCanonicalizing(
            ['three-days-in-the-cordillera', 'three-days-in-the-cordillera-2'],
            Post::pluck('slug')->all(),
        );
    }

    public function test_store_validates_fields(): void
    {
        $user = User::factory()->create();
        $taken = Post::factory()->create(['slug' => 'taken-slug']);

        $this->actingAs($user)
            ->post('/my-posts', [
                'title' => '',
                'slug' => 'Not A Slug',
                'excerpt' => 'short',
                'content' => 'too short',
                'category_id' => 9999,
                'destination_id' => '',
                'status' => 'archived',
            ])
            ->assertSessionHasErrors(['title', 'slug', 'excerpt', 'content', 'category_id', 'destination_id', 'status']);

        $this->actingAs($user)
            ->post('/my-posts', $this->payload(['slug' => $taken->slug]))
            ->assertSessionHasErrors('slug');

        $this->assertDatabaseCount('posts', 1);
    }

    public function test_cover_image_type_and_size_are_validated(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/my-posts', $this->payload(['cover_image' => UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf')]))
            ->assertSessionHasErrors('cover_image');

        $this->actingAs($user)
            ->post('/my-posts', $this->payload(['cover_image' => UploadedFile::fake()->create('huge.jpg', 3000, 'image/jpeg')]))
            ->assertSessionHasErrors('cover_image');

        $this->assertDatabaseCount('posts', 0);
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    public function test_owner_can_update_and_replace_the_cover_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $old = $this->image('old.png')->store('posts', 'public');
        $post = Post::factory()->for($user)->draft()->create(['cover_image' => $old]);

        $this->actingAs($user)
            ->put("/my-posts/{$post->id}", $this->payload([
                'title' => 'An updated title',
                'slug' => 'custom-slug',
                'status' => Post::PUBLISHED,
                'cover_image' => $this->image('new.png'),
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('my-posts.index'));

        $post->refresh();
        $this->assertSame('An updated title', $post->title);
        $this->assertSame('custom-slug', $post->slug);
        $this->assertTrue($post->isPublished());
        $this->assertNotSame($old, $post->cover_image);
        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists($post->cover_image);
    }

    public function test_owner_can_keep_slug_and_remove_cover_image_on_update(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $cover = $this->image()->store('posts', 'public');
        $post = Post::factory()->for($user)->create(['slug' => 'keep-me', 'cover_image' => $cover]);

        $this->actingAs($user)
            ->put("/my-posts/{$post->id}", $this->payload([
                'slug' => 'keep-me',
                'status' => Post::PUBLISHED,
                'remove_cover_image' => 1,
            ]))
            ->assertSessionHasNoErrors();

        $post->refresh();
        $this->assertSame('keep-me', $post->slug);
        $this->assertNull($post->cover_image);
        Storage::disk('public')->assertMissing($cover);
    }

    public function test_owner_can_publish_and_unpublish(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->draft()->create();

        $this->actingAs($user)->patch("/my-posts/{$post->id}/status", ['status' => Post::PUBLISHED]);
        $this->assertTrue($post->refresh()->isPublished());
        $this->get("/blog/{$post->slug}")->assertOk();

        $this->actingAs($user)->patch("/my-posts/{$post->id}/status", ['status' => Post::DRAFT]);
        $this->assertFalse($post->refresh()->isPublished());
        $this->get("/blog/{$post->slug}")->assertNotFound();
    }

    public function test_owner_can_preview_a_draft(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->draft()->create();

        $this->actingAs($user)->get("/my-posts/{$post->id}")->assertInertia(fn (Assert $page) => $page
            ->component('MyPosts/Preview')
            ->where('post.id', $post->id));
    }

    public function test_owner_can_delete_a_post_and_its_uploaded_cover(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $cover = $this->image()->store('posts', 'public');
        $post = Post::factory()->for($user)->create(['cover_image' => $cover]);

        $this->actingAs($user)
            ->delete("/my-posts/{$post->id}")
            ->assertRedirect(route('my-posts.index'));

        $this->assertModelMissing($post);
        Storage::disk('public')->assertMissing($cover);
    }

    public function test_users_cannot_view_edit_publish_or_delete_another_users_post(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $post = Post::factory()->for($owner)->draft()->create(['title' => 'Original title']);

        $this->actingAs($intruder)->get("/my-posts/{$post->id}")->assertForbidden();
        $this->actingAs($intruder)->get("/my-posts/{$post->id}/edit")->assertForbidden();
        $this->actingAs($intruder)->put("/my-posts/{$post->id}", $this->payload(['title' => 'Hijacked title']))->assertForbidden();
        $this->actingAs($intruder)->patch("/my-posts/{$post->id}/status", ['status' => Post::PUBLISHED])->assertForbidden();
        $this->actingAs($intruder)->delete("/my-posts/{$post->id}")->assertForbidden();

        $post->refresh();
        $this->assertSame('Original title', $post->title);
        $this->assertSame(Post::DRAFT, $post->status);
        $this->assertSame($owner->id, $post->user_id);
    }

    public function test_user_id_cannot_be_mass_assigned_through_the_form(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($user)->post('/my-posts', $this->payload(['user_id' => $other->id]));

        $this->assertSame($user->id, Post::sole()->user_id);
    }

    public function test_missing_post_returns_404(): void
    {
        $this->actingAs(User::factory()->create())->get('/my-posts/999/edit')->assertNotFound();
    }
}
