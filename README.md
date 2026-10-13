# Beyond the Map

*The world is bigger than your comfort zone.*

A travel blog about the Negros Island Region of the Philippines, with destinations, long-form stories, and a personal travel journal where signed-in authors write, draft, publish, and manage their own posts.

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 18 with Inertia 2, Vite 7 |
| Styling | Tailwind CSS 3, Lucide React icons |
| Auth | Laravel Breeze (session based) |
| Database | MySQL or MariaDB |

Pages are Inertia responses rendered by Laravel controllers, so there is no separate JSON API or client-side router.

## Features

- Public pages: Home, Destinations (list and detail), Travel Stories (list and article), About, Photo Credits
- Registration, login, logout, password reset, and profile management
- My Travel Journal at `/my-posts`: create, edit, preview, publish, unpublish, and delete your own stories
- Cover image upload with preview, validated for type (JPG, PNG, WebP) and size (2 MB)
- Server-side search, filters, and pagination for stories and destinations
- Ownership enforced by `PostPolicy`; drafts are never shown on public pages

## Setup

Requirements: PHP 8.2+, Composer, Node 20+, MySQL or MariaDB.

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Create the database, then check the `DB_*` values in `.env` (defaults suit XAMPP: user `root`, no password):

```sql
CREATE DATABASE lakbay_stories CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
php artisan migrate --seed
php artisan storage:link
```

Run the app:

```bash
php artisan serve
npm run dev
```

Open http://127.0.0.1:8000. With XAMPP's Apache it is also reachable at http://localhost/Lakbay-Stories/public.

### Sample account

The seeder creates categories, destinations, sample stories, and one author:

| Email | Password |
|---|---|
| author@beyondthemap.test | password |

The sample stories and the author profile on the About page are placeholder content. Replace them with your own, and change or remove the sample account before going live.

## Environment

| Variable | Purpose |
|---|---|
| `APP_NAME` | Shown in the browser title |
| `APP_URL` | Public URL of the site |
| `DB_*` | Database connection |
| `CONTACT_EMAIL` | Optional. When set, a contact button appears on the About page |

Site name, tagline, upload limit, and photo credits live in `config/site.php`.

The upload limit is 2 MB because that is PHP's default `upload_max_filesize`. To allow larger images, raise `upload_max_filesize` and `post_max_size` in `php.ini` and `max_upload_kb` in `config/site.php`.

## Writing stories

Story content is plain text. Leave a blank line between paragraphs and start a line with `## ` for a subheading. Content is never rendered as HTML.

## Tests

```bash
php artisan test
```

Tests run against an in-memory SQLite database and cover authentication, post CRUD, validation, image uploads, ownership rules, search, filters, and draft visibility.

## Deployment

1. Set `APP_ENV=production`, `APP_DEBUG=false`, and the real `APP_URL` and database credentials in `.env`.
2. Point the web server's document root at the `public` directory.
3. Run:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

4. Make `storage` and `bootstrap/cache` writable by the web server.
5. Make sure `public/hot` does not exist on the server. It is created by `npm run dev` and makes Laravel load assets from the dev server instead of the build.

Seed categories and destinations with `php artisan db:seed --force` if you want the starter content.

## Project layout

```
app/Http/Controllers   SiteController, BlogController, DestinationController, MyPostController
app/Http/Requests      PostRequest (validation for create and update)
app/Policies           PostPolicy (ownership)
app/Models             Post, Category, Destination, User
config/site.php        Site settings and photo credits
resources/js/Pages     Inertia pages
resources/js/Components Navbar, PostCard, PostForm, ImageUploader, and others
resources/js/hooks     useFilters (search and filter navigation)
public/images/seed     Photographs used by the seeded content
tests/Feature          PublicPagesTest, MyPostsTest, Breeze auth tests
```

## Image, Video, and Asset Credits

All photographs show places in the Negros Island Region of the Philippines (Negros Occidental, Negros Oriental, and Siquijor). They are stored in `public/images/seed` and were resized for the web (1280 to 1920 px wide); no other changes were made. No videos are used.

- Unsplash photos were downloaded through Unsplash's own download link for each photo. Creator names are taken from the credit Unsplash attaches to the download. The [Unsplash License](https://unsplash.com/license) allows free use without required attribution.
- Wikimedia Commons photos use the author and license reported by the Commons API for each file. The Creative Commons licenses require attribution, which is given here and on the site's `/credits` page (linked from the main navigation). CC BY-SA images remain under CC BY-SA.

| Asset | Creator | Source | Original URL | License |
|---|---|---|---|---|
| `kanlaon-volcano.jpg`: homepage hero, Mount Kanlaon destination | Bien02 | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Drone_Shot_of_Mt._Kanlaon.jpg | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| `kanlaon-trail.jpg`: story cover, About page | Jmevangelist | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Mt._Kanlaon_view_from_Don_Salvador_Benedicto.jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `sipalay-beach.jpg`: Sipalay destination, story cover | Paolobon140 | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Sipalay_Beach_(Negros_Occidental,_Philippines).jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `the-ruins.jpg`: Talisay destination, story cover | Brian Kairuz | Unsplash | https://unsplash.com/photos/QsRG5VAPNQo | Unsplash License |
| `balay-negrense.jpg`: Silay destination, story cover | Herbertkikoy | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Balay_Negrense_in_Silay.jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `dumaguete-market.jpg`: Dumaguete destination, story cover | MacroLingo LLC | Unsplash | https://unsplash.com/photos/qt39AU-AE6s | Unsplash License |
| `apo-turtle.jpg`: Apo Island destination | Anna Varona | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Sea_Turtle_in_Apo_Island.jpg | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| `apo-reef-turtle.jpg`: story cover | Gianni Orsatti | Unsplash | https://unsplash.com/photos/UcFzZLmQcW0 | Unsplash License |
| `manjuyod-sandbar.jpg`: Manjuyod Sandbar destination, story cover | Patrickroque01 | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Manjuyod_Sandbar_cottages_(Bais,_Negros_Oriental;_01-19-2023).jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `twin-lakes-mist.jpg`: Balinsasayao Twin Lakes destination | Vincent Lecolley | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:The_lake_in_the_clouds.jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `twin-lakes-trees.jpg`: story cover | Francisco M. Pajares, Jr. | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Balinsasayao_Twin_Lakes.jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `siquijor-cliff.jpg`: Siquijor destination, login and register pages | Nikko Lawrence Uy | Unsplash | https://unsplash.com/photos/u3Zf-4hPrh4 | Unsplash License |
| `cambugahay-falls.jpg`: story cover | Harry Fozzard | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Cambugahay_Falls_DSC00147_(34018408676).jpg | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| `salagdoong-beach.jpg`: story cover | Genpasaporte2 | Wikimedia Commons | https://commons.wikimedia.org/wiki/File:Salagdoong_Beach_Siquijor-Daylight.jpg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `negros-beach-aerial.jpg`: About page hero, draft story cover | XT7 Core | Unsplash | https://unsplash.com/photos/cArUZmt2Wfc | Unsplash License |

Other assets: Lucide icons (ISC License) and the Fraunces and Figtree typefaces (SIL Open Font License), served by Bunny Fonts.

When you add or replace a photo, update both this table and the `credits` list in `config/site.php`.
