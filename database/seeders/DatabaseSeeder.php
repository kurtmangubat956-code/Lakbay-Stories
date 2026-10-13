<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Destination;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $author = User::firstOrCreate(
                ['email' => 'author@beyondthemap.test'],
                ['name' => 'Maya Santos', 'password' => 'password', 'email_verified_at' => now()],
            );

            $categories = collect($this->categories())->mapWithKeys(fn (string $description, string $name) => [
                $name => Category::updateOrCreate(['slug' => Str::slug($name)], compact('name', 'description')),
            ]);

            $destinations = collect($this->destinations())->mapWithKeys(fn (array $row) => [
                $row['name'] => Destination::updateOrCreate(['slug' => Str::slug($row['name'])], $row),
            ]);

            foreach ($this->posts() as $index => $row) {
                $post = Post::firstOrNew(['slug' => Str::slug($row['title'])]);

                $post->fill([
                    'title' => $row['title'],
                    'excerpt' => $row['excerpt'],
                    'content' => trim($row['content']),
                    'cover_image' => '/images/seed/'.$row['image'],
                    'category_id' => $categories[$row['category']]->id,
                    'destination_id' => $destinations[$row['destination']]->id,
                    'status' => $row['draft'] ?? false ? Post::DRAFT : Post::PUBLISHED,
                    'published_at' => $row['draft'] ?? false ? null : now()->subDays(($index + 1) * 6),
                ]);

                $post->user()->associate($author)->save();
            }
        });
    }

    private function categories(): array
    {
        return [
            'Adventure' => 'Long trails, cold water, and the days that leave your legs shaking.',
            'Island Life' => 'Boats, reefs, and the slow rhythm of places surrounded by sea.',
            'Culture & Heritage' => 'Temples, terraces, and traditions that outlast every itinerary.',
            'Food & Markets' => 'What a place tastes like, from street stalls to morning markets.',
            'Slow Travel' => 'Staying longer, doing less, and noticing more.',
            'Travel Tips' => 'Practical notes on packing, planning, and getting around.',
        ];
    }

    private function destinations(): array
    {
        return [
            [
                'name' => 'Sipalay',
                'country' => 'Philippines',
                'region' => 'Negros Occidental',
                'cover_image' => '/images/seed/sipalay-beach.jpg',
                'is_featured' => true,
                'description' => "At the southern end of Negros Occidental, Sipalay is a long drive from Bacolod and feels it. The coast here is a run of wide brown-sugar beaches, rocky headlands, and coves that are easier to reach by boat than by road.\n\nThere is not much to do, which is the appeal. Days go to swimming, walking the beach at low tide, and watching the sun drop into the Sulu Sea.",
            ],
            [
                'name' => 'Talisay',
                'country' => 'Philippines',
                'region' => 'Negros Occidental',
                'cover_image' => '/images/seed/the-ruins.jpg',
                'is_featured' => true,
                'description' => "Just north of Bacolod, Talisay is sugar country: flat fields of cane, old hacienda roads, and the province's most photographed landmark. The Ruins are what remains of a grand mansion built in the early 1900s by a sugar baron in memory of his wife, and burned during the Second World War.\n\nThe concrete skeleton survived. Come late in the afternoon, when the low sun turns the columns gold.",
            ],
            [
                'name' => 'Silay',
                'country' => 'Philippines',
                'region' => 'Negros Occidental',
                'cover_image' => '/images/seed/balay-negrense.jpg',
                'is_featured' => false,
                'description' => "Silay grew rich on sugar and spent the money on houses. Dozens of ancestral homes from the late 1800s and early 1900s still line its streets, with wide wooden floors, capiz windows, and carved ventilation panels.\n\nSeveral are open as museums, including Balay Negrense. The city is small enough to explore on foot between stops for coffee and local pastries.",
            ],
            [
                'name' => 'Mount Kanlaon',
                'country' => 'Philippines',
                'region' => 'Negros Occidental',
                'cover_image' => '/images/seed/kanlaon-volcano.jpg',
                'is_featured' => false,
                'description' => "Kanlaon is the highest peak in the Visayas and an active volcano that dominates the middle of Negros Island. Its slopes are covered in forest and ringed by farms, cane fields, and cool upland towns.\n\nAccess to the summit depends on volcanic activity and is often closed, so check official advisories before planning a climb. The views from the surrounding highlands are open to everyone.",
            ],
            [
                'name' => 'Dumaguete',
                'country' => 'Philippines',
                'region' => 'Negros Oriental',
                'cover_image' => '/images/seed/dumaguete-market.jpg',
                'is_featured' => false,
                'description' => "The capital of Negros Oriental is a university town with a seafront boulevard, a busy public market, and a reputation for being easy to like. It calls itself the City of Gentle People.\n\nDumaguete is also the jumping-off point for much of the region: Apo Island, the Twin Lakes, the sandbar at Manjuyod, and the ferry to Siquijor are all within reach.",
            ],
            [
                'name' => 'Apo Island',
                'country' => 'Philippines',
                'region' => 'Negros Oriental',
                'cover_image' => '/images/seed/apo-turtle.jpg',
                'is_featured' => true,
                'description' => "A small volcanic island off the southern tip of Negros Oriental, Apo is known for a community-run marine sanctuary and for the sea turtles that graze in the shallows a few metres from shore.\n\nMost people visit on a day trip by outrigger boat. Staying overnight means quiet evenings, limited electricity, and the reef to yourself at first light.",
            ],
            [
                'name' => 'Manjuyod Sandbar',
                'country' => 'Philippines',
                'region' => 'Negros Oriental',
                'cover_image' => '/images/seed/manjuyod-sandbar.jpg',
                'is_featured' => false,
                'description' => "North of Dumaguete, a long strip of white sand rises out of the sea at low tide and disappears again a few hours later. Wooden cottages on stilts stand over it, surrounded by water when the tide is in.\n\nBoats leave from nearby Bais, and many trips combine the sandbar with dolphin watching in the Tañon Strait.",
            ],
            [
                'name' => 'Balinsasayao Twin Lakes',
                'country' => 'Philippines',
                'region' => 'Negros Oriental',
                'cover_image' => '/images/seed/twin-lakes-mist.jpg',
                'is_featured' => false,
                'description' => "In the mountains above Sibulan, two crater lakes sit side by side in a natural park of dense forest. The air is cool, the water is dark green, and cloud often rolls down to the surface.\n\nYou can paddle across the larger lake, walk the ridge between the two, and listen for birds you will probably never see.",
            ],
            [
                'name' => 'Siquijor',
                'country' => 'Philippines',
                'region' => 'Siquijor',
                'cover_image' => '/images/seed/siquijor-cliff.jpg',
                'is_featured' => true,
                'description' => "A short ferry ride from Dumaguete, Siquijor is a small island province with a coastal road that circles it, turquoise waterfalls inland, and a long-standing reputation for folk healing.\n\nRent a motorbike and go around slowly. There are cliff-top beaches, old stone churches, and a centuries-old balete tree along the way.",
            ],
        ];
    }

    private function posts(): array
    {
        return [
            [
                'title' => 'Three Slow Days on the Beaches of Sipalay',
                'category' => 'Island Life',
                'destination' => 'Sipalay',
                'image' => 'sipalay-beach.jpg',
                'excerpt' => 'Five hours south of Bacolod the road runs out of excuses. What is left is sand, a headland, and nothing on the schedule.',
                'content' => <<<'TXT'
The bus from Bacolod takes most of a morning, and somewhere past the last big town the cane fields give way to hills and glimpses of sea. By the time I stepped off in Sipalay I had stopped checking the time.

That turned out to be good preparation.

## A beach with room on it

The sand here is the colour of brown sugar, wide and firm at low tide. On my first walk I counted more fishing boats than people. A few children were racing a dog along the waterline; an old man was mending a net in the shade.

I swam, read forty pages, and swam again. That was the whole day.

## Around the headland

On the second morning I took a small outrigger around the point to a cove with no road to it. The boatman cut the engine early and we drifted in over water so clear I could see the anchor rope all the way down.

Lunch was grilled fish and rice at a place with four tables. Nobody was in a hurry to bring the bill, and I was in no hurry to pay it.

## What to know

Bring cash, because machines are few and sometimes empty. Come in the dry months if you can. And stay for sunset: the beach faces west, and the sky does something different every evening.
TXT,
            ],
            [
                'title' => 'Golden Hour at The Ruins',
                'category' => 'Culture & Heritage',
                'destination' => 'Talisay',
                'image' => 'the-ruins.jpg',
                'excerpt' => 'A mansion built for love, burned in a war, and still standing in the cane fields. It is at its best in the last hour of light.',
                'content' => <<<'TXT'
The road to The Ruins runs between walls of sugarcane taller than the tricycle. Then the fields open and there it is: two storeys of columns and arches with no roof, no floors, and the sky where the ceiling should be.

## A house built in grief

The mansion was built in the early 1900s by a sugar planter, Don Mariano Ledesma Lacson, in memory of his wife Maria Braga. During the Second World War it was set alight so that it could not be used as a headquarters. The timber burned for days. The concrete did not.

What remains is a frame, and somehow that makes it more affecting than a finished house would be. You can stand in what was the drawing room and look straight up at the clouds.

## Wait for the light

I arrived at four and almost left at five. I am glad I stayed. As the sun dropped, the grey concrete warmed to honey and then to a deep gold, and the whole structure seemed to glow from inside.

A guide was telling the family story to a small group with a comedian's timing. Half the lawn was laughing.

## Practical notes

Come late in the afternoon and stay until the lights come on. There is an entrance fee and a cafe on the grounds. From Bacolod it is a short ride by taxi or tricycle.
TXT,
            ],
            [
                'title' => 'Walking the Heritage Houses of Silay',
                'category' => 'Culture & Heritage',
                'destination' => 'Silay',
                'image' => 'balay-negrense.jpg',
                'excerpt' => 'Capiz windows, floors wide enough to dance on, and a city that kept its old houses when others tore theirs down.',
                'content' => <<<'TXT'
Silay does not announce itself. From the highway it looks like any other town on the way to the airport. Turn off onto the side streets, though, and the houses start: one after another, wooden and enormous, with shell-paned windows pushed open to the breeze.

## Inside Balay Negrense

The best known is Balay Negrense, the former home of the Gaston family and now a museum. The ground floor is stone and the upper floor is hardwood, with planks so long they must have come from trees nobody will see again.

What struck me was the air. Carved panels above every door let the wind move through the house, and the rooms open onto one another in a way that makes the whole floor feel like a single shaded veranda.

## The streets between

After the museum I simply walked. Some houses are restored and painted; others are fading gracefully behind their gates. A caretaker waved me in to look at a staircase. A bakery sold me a paper bag of something warm and buttery that I ate standing on the pavement.

## If you go

Give it half a day at least. Museums keep their own hours and some close on Mondays, so check ahead. Wear shoes you can slip off easily: many houses ask you to.
TXT,
            ],
            [
                'title' => 'Watching Kanlaon from the Highlands',
                'category' => 'Adventure',
                'destination' => 'Mount Kanlaon',
                'image' => 'kanlaon-trail.jpg',
                'excerpt' => 'The summit was closed, so we walked the ridges across the valley instead and let the volcano come to us.',
                'content' => <<<'TXT'
We had planned to climb. Then the alert level went up, the trails closed, and the plan became something better suited to my knees: find the best place to look at the mountain and stay there until dark.

## Up into the cool

The road into the highlands climbs fast. Within an hour of leaving the coast the air had cooled enough for a jacket, and pine trees had begun to appear beside the road. We stopped at a viewpoint where a dirt track ran out along a grassy ridge.

Kanlaon filled the horizon, its upper slopes going in and out of cloud. Every few minutes the whole shape changed.

## Walking the ridge

The track wandered between shoulder-high shrubs and patches of open grass. Farmers passed us carrying sacks of vegetables. A boy on a horse asked where we were from and whether we had seen the volcano smoke.

We had not, that day. But we watched the light move across its flanks for two hours, and I did not once wish I were on top of it.

## Before you plan a climb

Kanlaon is active. Access is controlled, permits are required, and closures can come at short notice. Always check current advisories from the authorities, and treat a closed trail as a gift of time rather than a loss.
TXT,
            ],
            [
                'title' => 'A Market Morning in Dumaguete',
                'category' => 'Food & Markets',
                'destination' => 'Dumaguete',
                'image' => 'dumaguete-market.jpg',
                'excerpt' => 'Sticky rice, thick hot chocolate, and pyramids of mangoes: breakfast at the public market before the city wakes up.',
                'content' => <<<'TXT'
The right time to arrive at the Dumaguete public market is while the streetlights are still on. That is when the breakfast stalls are busiest and the fruit is still being stacked.

## Breakfast at the painitan

In one corner of the market is a row of counters known as the painitan. You sit on a stool, point, and are handed budbud, a roll of sticky rice steamed in banana leaf, with a cup of tsokolate so thick it coats the spoon.

The trick, a woman beside me explained, is to dip the rice into the chocolate. She was right. I ordered a second round and a ripe mango to go with it.

## Through the stalls

Afterwards I wandered the aisles. Pineapples hung in rows from the rafters. There were watermelons, bananas in five sizes, and vegetables I could not name. A vendor let me taste something sour and laughed at my face.

By seven the tricycles were lining up outside and the city had begun its day.

## Then walk it off

From the market it is a short stroll to the seafront boulevard, where people jog, fish, and sit facing the water. Find a bench. You have already had the best meal of the day.
TXT,
            ],
            [
                'title' => 'Swimming with Sea Turtles at Apo Island',
                'category' => 'Adventure',
                'destination' => 'Apo Island',
                'image' => 'apo-reef-turtle.jpg',
                'excerpt' => 'A bumpy boat ride, a mask and snorkel, and an animal the size of a coffee table eating breakfast an arm\'s length away.',
                'content' => <<<'TXT'
The crossing was rougher than the brochure suggested. Our outrigger slapped across the channel for half an hour, and everyone on board arrived soaked and grinning.

Ten minutes later I was floating face down over a turtle.

## In the shallows

They feed close to shore, in water barely deeper than I am tall. The first one I saw was tearing at sea grass with complete concentration. It surfaced for a breath, looked at me without interest, and went back down.

Local guides swim with every group and keep people at a respectful distance. Nobody touches the turtles. Nobody needs to; they come close enough on their own.

## Over the reef

Further out the bottom drops away into coral gardens: plates, branches, and great brain-like domes, with fish moving over them in clouds. The islanders set up a marine sanctuary here decades ago and still manage it themselves. It shows.

## How to do it right

Use reef-safe sunscreen or wear a rash guard. Do not stand on coral, and do not chase anything. Go with a registered guide, pay the sanctuary fees, and bring a dry bag for the ride back.
TXT,
            ],
            [
                'title' => 'Low Tide at the Manjuyod Sandbar',
                'category' => 'Island Life',
                'destination' => 'Manjuyod Sandbar',
                'image' => 'manjuyod-sandbar.jpg',
                'excerpt' => 'For a few hours each day a ribbon of white sand rises out of the sea. Then the water takes it back.',
                'content' => <<<'TXT'
When we arrived there was no sandbar. There were three wooden cottages standing on stilts in open water, a grey sky, and a boatman who told us to wait.

So we waited.

## The sea steps back

It happened slowly and then all at once. The water around the stilts paled from green to jade to almost clear. A line of white appeared, then widened, and within an hour we were walking on sand that had been under a metre of sea when we tied up.

Children ran its length. Someone started a game of volleyball. A vendor paddled over in a small boat selling fresh shellfish.

## Dolphins on the way

We had left Bais early to look for dolphins in the strait first. A pod found us before we found them, riding the bow wave for several minutes and then peeling away as if on a signal.

## Timing is everything

Check the tide tables before you book, because at high tide there is nothing to stand on. Bring your own food and plenty of water. And pack shade: out there, the only roof is the one you rent.
TXT,
            ],
            [
                'title' => 'A Quiet Morning at the Twin Lakes',
                'category' => 'Slow Travel',
                'destination' => 'Balinsasayao Twin Lakes',
                'image' => 'twin-lakes-trees.jpg',
                'excerpt' => 'Two crater lakes in a cloud forest above Dumaguete, a rented paddle boat, and an hour without a single engine.',
                'content' => <<<'TXT'
The road up from the coast is steep, narrow, and lined with ferns. Somewhere in the last few kilometres the temperature dropped and the sea view vanished behind us into cloud.

Then the trees parted and the lake was there, dark green and perfectly still.

## Out on the water

We rented a small boat and pushed off. The forest comes right down to the shore, and trees stand with their roots in the water, doubled in the reflection. Mist drifted across in bands. For long stretches the only sound was the paddle.

A kingfisher crossed in front of us, a blue streak, and was gone before I could point.

## The ridge between

A short path climbs to a viewing deck on the narrow ridge that separates the two lakes. From there you can see both at once: the larger one we had crossed, and its smaller twin lying quiet in the next hollow.

We stayed until the cloud closed in again.

## Getting there

Go early, before the day-trippers and the afternoon rain. Hire a motorbike or a driver from Dumaguete, because public transport stops at the highway. Bring a light jacket; it is cooler than you expect.
TXT,
            ],
            [
                'title' => 'The Turquoise Pools of Cambugahay Falls',
                'category' => 'Adventure',
                'destination' => 'Siquijor',
                'image' => 'cambugahay-falls.jpg',
                'excerpt' => 'Three tiers of milky blue water in the forest of Siquijor, a rope swing, and the nerve to let go.',
                'content' => <<<'TXT'
You hear Cambugahay before you see it. A long flight of steps leads down from the road through the trees, and the sound of falling water grows with every turn.

At the bottom the forest opens onto a pool the colour of a swimming pool, except nobody painted it.

## Three tiers

The falls come down in broad, low steps, each with its own basin. The water is cool and slightly milky, and the limestone underfoot is rounded and smooth. I swam to the base of the lowest fall and let it drum on my shoulders.

Upstream the pools are smaller and quieter. I found one with nobody in it and floated on my back looking up at the canopy.

## The swing

Then there is the rope swing. Local boys operate it, coach you, and count you down. I stood on the platform far longer than was dignified. When I finally let go, the drop took about a second and felt like ten.

I went back up four more times.

## Good to know

Arrive early; by late morning it is busy. Bring small bills for the entrance, parking, and the swing. Water shoes help on the rocks, and a dry bag keeps your phone out of trouble.
TXT,
            ],
            [
                'title' => 'How to Loop Siquijor by Motorbike in a Day',
                'category' => 'Travel Tips',
                'destination' => 'Siquijor',
                'image' => 'salagdoong-beach.jpg',
                'excerpt' => 'One coastal road, a handful of stops, and a few things I wish I had known before turning the key.',
                'content' => <<<'TXT'
Siquijor is small enough that a single road runs all the way around it, and quiet enough that riding it is a pleasure rather than a test. With an early start you can circle the island in a day and still have time to swim.

## Renting and riding

Motorbikes are easy to rent near the port and in the main beach areas. Check the brakes, lights, and tyres before you leave, photograph any existing scratches, and wear the helmet. Carry your licence.

Fuel is sold at stations in the larger towns and by the bottle at roadside stalls. Fill up before the quieter eastern side.

## Stops worth making

Go clockwise or anticlockwise; it makes little difference. I stopped at the old balete tree, where a spring-fed pool sits among the roots, then at the stone church and convent in Lazi, then at the falls inland.

Salagdoong Beach, on the east coast, was the highlight: clear water, a rocky outcrop, and platforms for those who like to jump. I liked to watch.

## Small things that help

Start by seven to beat the heat. Bring a rain jacket even on a clear day. Keep small bills for entrance and parking fees. And plan to be back before dark, because the road is unlit in long stretches and dogs like to sleep on it.
TXT,
            ],
            [
                'title' => 'Notes for a Longer Trip Around Negros',
                'category' => 'Travel Tips',
                'destination' => 'Dumaguete',
                'image' => 'negros-beach-aerial.jpg',
                'draft' => true,
                'excerpt' => 'An unfinished list of what I would change next time: where to base myself, how to cross the island, and how many days are enough.',
                'content' => <<<'TXT'
This is a working draft. I am collecting notes for a longer guide and will publish it when the details are checked.

## Things to confirm

Bus and ferry schedules between the two provinces and Siquijor, current fees at the parks and sanctuaries, and which mountain trails are open.

## Rough outline

Start in Bacolod and work south and east. Leave two unplanned days. Travel in the dry months if the weather allows, and book the first and last nights only.
TXT,
            ],
        ];
    }
}
