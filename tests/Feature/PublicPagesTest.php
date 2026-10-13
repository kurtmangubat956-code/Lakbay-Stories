<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_render(): void
    {
        Post::factory()->create();

        foreach (['/', '/destinations', '/blog', '/about', '/credits'] as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_home_lists_only_published_posts(): void
    {
        Post::factory()->create(['title' => 'Visible story']);
        Post::factory()->draft()->create(['title' => 'Hidden draft']);
        Post::factory()->create(['title' => 'Scheduled story', 'published_at' => now()->addWeek()]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('latestPosts', 1)
            ->where('latestPosts.0.title', 'Visible story'));
    }

    public function test_blog_index_excludes_drafts_and_paginates(): void
    {
        Post::factory()->count(11)->create();
        Post::factory()->draft()->count(2)->create();

        $this->get('/blog')->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Index')
            ->where('posts.total', 11)
            ->has('posts.data', 9));

        $this->get('/blog?page=2')->assertInertia(fn (Assert $page) => $page->has('posts.data', 2));
    }

    public function test_blog_search_matches_title_and_content(): void
    {
        Post::factory()->create(['title' => 'Kayaking the lagoon']);
        Post::factory()->create(['content' => str_repeat('A long walk past a lagoon at dusk. ', 5)]);
        Post::factory()->create(['title' => 'Mountain huts']);
        Post::factory()->draft()->create(['title' => 'Secret lagoon draft']);

        $this->get('/blog?search=lagoon')->assertInertia(fn (Assert $page) => $page->where('posts.total', 2));
    }

    public function test_blog_filters_by_category_and_destination_together(): void
    {
        $category = Category::factory()->create(['slug' => 'adventure']);
        $destination = Destination::factory()->create(['slug' => 'el-nido']);

        Post::factory()->create(['category_id' => $category->id, 'destination_id' => $destination->id]);
        Post::factory()->create(['category_id' => $category->id]);
        Post::factory()->create(['destination_id' => $destination->id]);

        $this->get('/blog?category=adventure')->assertInertia(fn (Assert $page) => $page->where('posts.total', 2));
        $this->get('/blog?category=adventure&destination=el-nido')
            ->assertInertia(fn (Assert $page) => $page->where('posts.total', 1));
    }

    public function test_published_post_is_visible_by_slug_with_related_posts(): void
    {
        $post = Post::factory()->create(['slug' => 'my-story']);
        Post::factory()->create(['destination_id' => $post->destination_id]);
        Post::factory()->draft()->create(['destination_id' => $post->destination_id]);

        $this->get('/blog/my-story')->assertInertia(fn (Assert $page) => $page
            ->component('Blog/Show')
            ->where('post.slug', 'my-story')
            ->has('related', 1));
    }

    public function test_draft_post_is_not_public_even_for_its_owner(): void
    {
        $draft = Post::factory()->draft()->create();

        $this->get("/blog/{$draft->slug}")->assertNotFound();
        $this->actingAs($draft->user)->get("/blog/{$draft->slug}")->assertNotFound();
    }

    public function test_missing_post_and_destination_return_404(): void
    {
        $this->get('/blog/does-not-exist')->assertNotFound();
        $this->get('/destinations/does-not-exist')->assertNotFound();
    }

    public function test_destinations_can_be_searched_and_filtered(): void
    {
        Destination::factory()->create(['name' => 'El Nido', 'country' => 'Philippines', 'region' => 'Asia']);
        Destination::factory()->create(['name' => 'Banaue', 'country' => 'Philippines', 'region' => 'Asia']);
        Destination::factory()->create(['name' => 'Santorini', 'country' => 'Greece', 'region' => 'Europe']);

        $total = fn (int $count) => fn (Assert $page) => $page->where('destinations.total', $count);

        $this->get('/destinations?search=nido')->assertInertia($total(1));
        $this->get('/destinations?search=philippines')->assertInertia($total(2));
        $this->get('/destinations?country=Greece')->assertInertia($total(1));
        $this->get('/destinations?region=Asia&search=banaue')->assertInertia($total(1));
        $this->get('/destinations?search=atlantis')->assertInertia($total(0));
    }

    public function test_destination_page_shows_only_its_published_posts(): void
    {
        $destination = Destination::factory()->create(['slug' => 'kyoto']);
        Post::factory()->create(['destination_id' => $destination->id]);
        Post::factory()->draft()->create(['destination_id' => $destination->id]);
        Post::factory()->create();

        $this->get('/destinations/kyoto')->assertInertia(fn (Assert $page) => $page
            ->component('Destinations/Show')
            ->has('posts', 1));
    }
}
