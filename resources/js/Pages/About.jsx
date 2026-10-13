import HeroSection from '@/Components/HeroSection';
import SmartImage from '@/Components/SmartImage';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Footprints, HeartHandshake, Mail, NotebookPen } from 'lucide-react';

const principles = [
    {
        icon: Footprints,
        title: 'Go slowly',
        text: 'Fewer stops, longer stays. A place only starts to make sense on the third morning.',
    },
    {
        icon: HeartHandshake,
        title: 'Travel with respect',
        text: 'Hire local guides, pay the fees, ask before photographing, and leave things as you found them.',
    },
    {
        icon: NotebookPen,
        title: 'Tell it honestly',
        text: 'The missed bus and the rained-out summit belong in the story as much as the sunrise does.',
    },
];

const interests = ['Island hopping', 'Heritage houses', 'Market breakfasts', 'Reef snorkelling', 'Highland walks', 'Film photography'];

export default function About({ contactEmail, stats }) {
    const { site } = usePage().props;

    return (
        <SiteLayout overlayNav>
            <Head title="About" />

            <HeroSection
                size="md"
                image={`${site.images}/negros-beach-aerial.jpg`}
                alt="Aerial view of a palm-lined beach in Negros Oriental"
                eyebrow="About"
                title="Why we go further"
                credit="Photo: XT7 Core / Unsplash"
            />

            <section className="container-page grid gap-12 pt-16 lg:grid-cols-[3fr_2fr]">
                <div className="max-w-2xl space-y-6 text-lg leading-8 text-ink/80">
                    <p className="font-serif text-2xl leading-9 text-ink">
                        {site.name} is a travel journal about the Negros Island Region, for people who suspect the best
                        part of a trip begins where the guidebook stops.
                    </p>
                    <p>
                        We started it for a simple reason: the stories we wanted to read were not lists of ten things
                        to do. They were accounts of what it actually felt like to walk into a valley at dawn, get lost
                        in a market, or sit out a storm in a mountain hut with strangers.
                    </p>
                    <p>
                        Our tagline is a reminder to ourselves as much as anyone. {site.tagline} Comfort is a fine
                        place to rest, but very little that is memorable happens there.
                    </p>
                    <p>
                        Every story here is written by someone who made the trip. Anyone can create an account, keep a
                        private journal of drafts, and publish when the piece is ready.
                    </p>
                </div>

                <dl className="grid h-fit grid-cols-3 gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 text-center lg:grid-cols-1 lg:text-left">
                    {[
                        ['Stories published', stats.stories],
                        ['Destinations', stats.destinations],
                        ['Countries', stats.countries],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <dd className="font-serif text-4xl text-forest-700">{value}</dd>
                            <dt className="mt-1 text-sm text-ink/60">{label}</dt>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="container-page pt-20">
                <p className="eyebrow">What we believe</p>
                <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Three rules for the road</h2>
                <ul className="mt-10 grid gap-6 md:grid-cols-3">
                    {principles.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="rounded-2xl border border-cream-300 bg-cream-50 p-6">
                            <Icon className="h-7 w-7 text-forest-600" aria-hidden="true" strokeWidth={1.5} />
                            <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                            <p className="mt-2 leading-relaxed text-ink/70">{text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="container-page grid items-center gap-10 pt-24 md:grid-cols-2">
                <SmartImage
                    src={`${site.images}/kanlaon-trail.jpg`}
                    alt="A dirt trail through green highlands with Mount Kanlaon in the distance"
                    className="aspect-[4/3] rounded-3xl"
                />
                <div>
                    <p className="eyebrow">The author</p>
                    <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Maya Santos</h2>
                    <p className="mt-4 text-lg leading-8 text-ink/80">
                        Maya grew up on Negros between the cane fields and the sea, and has been exploring both coasts
                        ever since. She writes most of the stories on {site.name}, usually from a notebook first and
                        a laptop much later.
                    </p>
                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-ink/60">Travel interests</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <li key={interest} className="rounded-full bg-forest-50 px-3 py-1.5 text-sm text-forest-800">
                                {interest}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link href={route('blog.index')} className="btn-primary">
                            Read the stories
                        </Link>
                        {contactEmail && (
                            <a href={`mailto:${contactEmail}`} className="btn-secondary">
                                <Mail className="h-4 w-4" aria-hidden="true" />
                                {contactEmail}
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
