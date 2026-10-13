import SmartImage from '@/Components/SmartImage';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

export default function Credits({ credits }) {
    return (
        <SiteLayout>
            <Head title="Photo Credits" />

            <div className="container-page py-14">
                <header className="max-w-2xl">
                    <p className="eyebrow">Credits</p>
                    <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">Photo credits</h1>
                    <p className="mt-4 text-lg text-ink/70">
                        The photographs across this site were shared by the photographers below on Unsplash and
                        Wikimedia Commons. Each is used under the license shown and has been resized for the web.
                        Cover images uploaded by authors belong to those authors.
                    </p>
                </header>

                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {credits.map((credit) => (
                        <li key={credit.file} className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50">
                            <SmartImage src={credit.preview} alt={credit.description} className="aspect-[3/2]" />
                            <div className="p-5">
                                <p className="text-sm leading-relaxed text-ink/80">{credit.description}</p>
                                <p className="mt-3 text-sm text-ink/60">
                                    Photo by <span className="font-medium text-ink">{credit.creator}</span> on{' '}
                                    {credit.source}
                                </p>
                                <p className="mt-1 text-sm text-ink/60">
                                    License:{' '}
                                    <a
                                        href={credit.license_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-forest-700 underline underline-offset-4"
                                    >
                                        {credit.license}
                                    </a>
                                </p>
                                <a
                                    href={credit.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-900"
                                >
                                    View original
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span className="sr-only">(opens in a new tab)</span>
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </SiteLayout>
    );
}
